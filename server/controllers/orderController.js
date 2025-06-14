import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { notificationEmitter } from "../routes/notification.js";

// Get all orders of a user
export async function getAllOrdersOfUser(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .populate("shippingAddress");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
}

// Get order by ID
export async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product") // Populate full product
      .populate("user", "name email")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching order" });
  }
}

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product", "name price images requiresPrescription")
      .populate(
        "shippingAddress",
        "addressLine1 city state postalCode coordinates"
      )
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JavaScript objects

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      orderNumber: order._id.toString().slice(-8).toUpperCase(),
      customerName: order.user?.name || "Guest User",
      orderDate: order.createdAt,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      prescriptionRequired: order.items.some(
        (item) => item.product?.requiresPrescription || false
      ),
      prescriptionStatus: order.prescriptionStatus || "notRequired",
      shippingAddress: order.shippingAddress,
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Create new order
export async function createOrder(req, res) {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

    // Get user object to use for name in notification
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }
    }

    // Reduce stock and check low stock for each product
    for (const item of items) {
      const product = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (product.stock <= 10) {
        const notification = new Notification({
          title: "Low Stock Alert",
          message: `${product.name} is running low on stock.`,
          type: "stock",
          targetId: product._id, // <- required field
        });
        const savedNotification = await notification.save();

        notificationEmitter.emit("newNotif", savedNotification);
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      status: "pending",
    });

    await order.save();

    const notification = new Notification({
      title: "New Order Received",
      message: `Order #${order._id} has been placed successfully.`,
      type: "order",
      targetId: order._id,
    });

    const savedNotification = await notification.save();

    // 3. Emit it to SSE stream
    notificationEmitter.emit("newNotif", savedNotification);

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res
      .status(400)
      .json({ message: "Error creating order", error: error.message });
  }
}

// Update order status (admin only)
export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Block any further updates if user already cancelled
    if (order.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Cannot update a cancelled order" });
    }

    // Apply the new status
    order.status = newStatus;

    // If we’re marking delivered, also complete payment and set delivered flag/date
    if (newStatus === "delivered") {
      order.paymentStatus = "completed";
      order.deliveryDate = new Date(); // or order.deliveryStatus = 'delivered'
      order.deliveryStatus = "delivered";
    }

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error updating order status", error: err.message });
  }
}

// Cancel order
export async function cancelOrder(req, res) {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: "pending",
    });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or cannot be cancelled" });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Error cancelling order" });
  }
}

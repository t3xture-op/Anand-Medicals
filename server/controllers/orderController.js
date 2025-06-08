import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Get all orders of a user
export async function getAllOrdersOfUser(req, res) {
  try {
    const orders = await Order.find({ user: req.userId })
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
      .populate('items.product') // Populate full product
      .populate('user', 'name email')
      .populate('shippingAddress');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order' });
  }
}






// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name price images requiresPrescription')
      .populate('shippingAddress', 'addressLine1 city state postalCode')
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JavaScript objects

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    const formattedOrders = orders.map(order => ({
      id: order._id,
      orderNumber: order._id.toString().slice(-8).toUpperCase(),
      customerName: order.user?.name || 'Guest User',
      orderDate: order.createdAt,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      prescriptionRequired: order.items.some(item => 
        item.product?.requiresPrescription || false
      ),
      prescriptionStatus: order.prescriptionStatus || 'notRequired',
      shippingAddress: order.shippingAddress
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      message: 'Error fetching orders',
      error: error.message 
    });
  }
};



// Create new order
export async function createOrder(req, res) {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

    // Check stock availability before creating order
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

    // Reduce stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create order
    const order = new Order({
      user: req.userId,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      status: "pending",
    });

    await order.save();

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
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Error updating order status" });
  }
}

// Cancel order
export async function cancelOrder(req, res) {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId,
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

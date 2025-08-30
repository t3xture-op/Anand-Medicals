import ProductReq from "../models/ProductReq.js";
import Notification from "../models/Notification.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { notificationEmitter } from "../routes/notification.js";

export async function reqProduct(req, res) {
  try {
    const { name, category, manufacturer, description, quantity } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const reqProduct = new ProductReq({
      user,
      name,
      category,
      manufacturer,
      description,
      quantity,
    });

    await reqProduct.save();
    const notification = new Notification({
      title: "New Product Request Received",
      message: `Request #${reqProduct._id} has been placed successfully.`,
      type: "product request",
      targetId: reqProduct._id,
    });

    const savedNotification = await notification.save();
    notificationEmitter.emit("newNotif", savedNotification);

    res.status(201).json(reqProduct);
  } catch (error) {
    console.error("Request creation error:", error);
    res.status(400).json({ message: "Error creating request", error: error.message });
  }
}

export async function getProductReqById(req, res) {
  try {
    const reqProduct = await ProductReq.findById(req.params.id)
      .populate("user")
      .lean();

    if (!reqProduct) {
      return res.status(404).json({ message: "Product Request not found" });
    }

    res.status(200).json(reqProduct); // ✅ 200 OK for GET
  } catch (error) {
    console.error("Cannot find Request", error);
    res.status(400).json({ message: "Error finding request", error: error.message });
  }
}


export async function getAllProductReq(req,res) {
    try {
        const reqProduct = await ProductReq.find({})
              .populate("user")
              .sort({ createdAt: -1 })
              .lean(); // Convert to plain JavaScript objects
        
            if (!reqProduct || reqProduct.length === 0) {
              return res.status(200).json([]);
            }
            res.status(200).json(reqProduct);
    } catch (error) {
        console.error("Cannot fetch requests", error);
    res.status(400).json({ message: "Error finding request", error: error.message });
    }
}



export async function changeReqStatus(req, res) {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const reqProduct = await ProductReq.findById(id);
    if (!reqProduct) return res.status(404).json({ message: "Request not found" });

    if (reqProduct.request_status === "cancelled") {
      return res.status(400).json({ message: "Cannot update a cancelled request" });
    }

    reqProduct.request_status = newStatus;
    const updated = await reqProduct.save();

    // ✅ if status is "available", create a notification
    if (newStatus === "available") {
      // check if product exists in store
      const existingProduct = await Product.findOne({ name: reqProduct.name });

      let targetId = null;
      if (existingProduct) {
        targetId = existingProduct._id; // case 1: product really exists
      }

      await Notification.create({
        title: "Product Available",
        message: `Your requested product "${reqProduct.name}" is now available in our store.`,
        type: "product request",
        targetId: targetId || reqProduct._id, // fallback: store request id
        user: reqProduct.user,
      });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating request status", error: err.message });
  }
}



export async function deleteProductReq(req, res) {
  try {
    const reqProduct = await ProductReq.findById(req.params.id);
    if (!reqProduct) return res.status(404).json({ message: 'Product request not found' });

    await reqProduct.deleteOne();
    res.json({ message: 'Product request deleted successfully' });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: 'Error deleting product request', error: error.message });
  }
}

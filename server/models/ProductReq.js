import mongoose from "mongoose";

const productReqSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
  },
  manufacturer: {
    type: String,
  },
  description: {
    type: String,
  },
  request_status: {
    type: String,
    enum: ["pending", "available", "cancelled", "not available"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ProductRequest", productReqSchema);

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: {
     type: String,
      required: true
   },
  message: {
     type: String, 
     required: true 
  },
  type: {
    type: String,
    enum: ["order", "user", "prescription", "stock"],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type' // optional: helps populate based on type
  },
  isRead: {
    type: Boolean,
     default: false 
   },
   createdAt: { 
    type: Date, 
    default: Date.now
   },
});

export default mongoose.model("Notification", notificationSchema);

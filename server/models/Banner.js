// models/Banner.js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String, // Cloudinary URL or local path
      required: true,
    },
    name: {
      type: String,
    },
    description:{
      type:String,
      default:""
    },
    link: {
      type: String,
      default: ""
    },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);

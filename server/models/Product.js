import mongoose from 'mongoose';
import { type } from 'os';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },

  composition:{
    type:String,
  },
  
  discount: {
    type:Number,
    default:13
  },
  discount_price: {
    type:Number,
  },
  description: {
    type: String,
  },
  category: {
  type: String,
  required: true
},
  subcategory: {
  type: String,
},
  image: {
  type:String
},
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  manufacturer: {
    type: String,
    required: true
  },
  prescription_status:{
    type:Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Product', productSchema);
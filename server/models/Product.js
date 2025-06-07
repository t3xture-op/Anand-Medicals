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
  description: {
    type: String,
    //required: true
  },
  category: {
  type: String,
  required: true
},
  image: {
  type:String
},
  stock: {
    type: Number,
    //required: true,
    min: 0
  },
  manufacturer: {
    type: String,
    //required: true
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
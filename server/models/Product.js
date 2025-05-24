import mongoose from 'mongoose';

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
    //required: true
  },
  image: {
    url: String,
    public_id: String,
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Product', productSchema);
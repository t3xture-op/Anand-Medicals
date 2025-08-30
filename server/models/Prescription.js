import mongoose from 'mongoose';
import Product from './Product.js';

const prescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  image: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
  },
  doctorSpecialization: String,
   order: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "Order",
     default: null
     },
  
  medicine:{
    type:mongoose.Schema.Types.ObjectId,
    ref:Product,
  },
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Prescription', prescriptionSchema);
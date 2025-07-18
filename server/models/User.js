import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Cart from './Cart.js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone:{
    type:Number,
    default:""
  },
  dob:{
    type:Date,
    default:""
  },
  image:{
    type:String,
    default:""
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  access_token: {
    type: String,
    default:""
  },
  refresh_token: {
    type: String,
    default:""
  },
  status: {
    type: String,
    enum:['Active','Not Active','suspended'],
    default:'Active'
  },
  last_login_date:{
    type:Date,
    default:""
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  shopping_cart:{
    type:mongoose.Schema.ObjectId,
    ref:'Cart'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);

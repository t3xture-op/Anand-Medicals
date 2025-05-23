import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  }
});

// OTP expires after 10 minutes
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 600 });

export default mongoose.model('PasswordReset', passwordResetSchema);
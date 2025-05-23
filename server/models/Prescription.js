import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  doctorSpecialization: String,
  medicines: [{
    name: {
      type: String,
      required: true
    },
    dosage: String,
    frequency: String
  }],
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
import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    required: true,
  },
},
{ timestamps: true }
);

export default mongoose.model('SubCategory', subCategorySchema);

import SubCategory from '../models/SubCategory.js';

// Get all subcategories
export const getAllSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate('name', 'emoji');
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subcategories' });
  }
};


// Add new subcategory
export const addSubCategory = async (req, res) => {
  try {
    const { name, emoji } = req.body;
    const subcategory = new SubCategory({ name, emoji});
    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create subcategory', error: err.message });
  }
};

// Delete subcategory
export const deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subcategory deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// Edit subcategory
export const updateSubCategory = async (req, res) => {
  try {
    const { name, emoji} = req.body;
    const updated = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { name, emoji },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
};

// Get single subcategory
export const getSubCategoryById = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id).populate('name', 'emoji');
    res.json(subcategory);
  } catch (err) {
    res.status(404).json({ message: 'Subcategory not found' });
  }
};

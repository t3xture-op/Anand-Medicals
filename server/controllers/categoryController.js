import Category from "../models/Category.js";
import slugify from "slugify";
import { v2 as cloudinary } from 'cloudinary';
import {extractPublicId} from 'cloudinary-build-url';
import fs from 'fs';

//get all category
export async function getAllCategory(req, res) {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    return res.status(500).json({
      message: "error fetching categories",
    });
  }
}

//get category by id
export async function getCategoryById(req, res) {
  try {
    const id = req.params.id.trim();
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return res.status(500).json({ message: "Error fetching category" });
  }
}

//create category(Admin only)
export async function createCategory(req, res) {
  try {

    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = slugify(name.trim(), { lower: true, strict: true });
    let imageData = "";

    if (req.file) {
      // multer-storage-cloudinary automatically uploads image and stores URL info in req.file
      imageData = req.file.path || req.file.location || req.file.secure_url || "";
    }

    const category = new Category({
      name: name.trim(),
      description,
      slug,
      image: imageData,
    });

    await category.save();

    return res.status(201).json(category);
  } catch (error) {
    console.error("Create Category Error:", error);
    return res.status(400).json({ message: "Error creating category", error: error.message });
  }
}




//update category(admin only)
export async function updateCategory(req, res) {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update text fields
    category.name = name ?? category.name;
    category.description = description ?? category.description;
    category.slug = slugify(category.name.trim(), { lower: true, strict: true });

    // Check if new file is uploaded
    if (req.file) {
      // 1. Delete previous image from Cloudinary
      if (category.image) {
        const publicId = extractPublicId(category.image);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }

      let uploadedUrl = '';

      // 2. Handle Cloudinary-based multer upload (req.file.path is already a URL)
      if (req.file.path.startsWith('http')) {
        uploadedUrl = req.file.path;
      } else {
        // 3. Handle local disk upload (req.file.path is local)
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'category',
        });
        uploadedUrl = result.secure_url;
        fs.unlinkSync(req.file.path); // cleanup local file
      }

      category.image = uploadedUrl;
    }

    await category.save();
    res.status(200).json({ message: "Category updated successfully", category });

  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ message: "Error updating category", error: error.message });
  }
}


//delete category
export async function deleteCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    // Delete image from Cloudinary if it exists
    if (category.image) {
          const publicId = extractPublicId(category.image);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }

    // Delete the category document
    await category.deleteOne();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(400).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
}

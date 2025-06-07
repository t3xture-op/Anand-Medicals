import Product from '../models/Product.js';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';



//get all products
export async function getAllProducts(req,res){
     try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
}


//get product by id
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
}


// Create new product (admin only)
export async function createProduct(req, res) {
  try {
    const {
      name,
      category,
      price,
      stock,
      manufacturer,
      description,
      prescription_status,
    } = req.body;

    let imageData = "";

    if (req.file) {
      // With multer-storage-cloudinary, image is already uploaded
      imageData = req.file.path || req.file.location || req.file.secure_url || "";
    }

    const newProduct = new Product({
      name,
      category,
      price,
      stock,
      manufacturer,
      description,
      prescription_status,
      image: imageData,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}


//update product
export async function updateProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      prescription_status,
      manufacturer
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete old image if new one is uploaded
    if (req.file && product.image) {
      const publicId = extractPublicId(product.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Update fields
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;
    product.manufacturer = manufacturer ?? product.manufacturer;

    if (typeof prescription_status === 'string') {
      product.prescription_status = prescription_status === 'true';
    } else if (typeof prescription_status === 'boolean') {
      product.prescription_status = prescription_status;
    }

    // Image assignment (Cloudinary multer already uploaded)
    if (req.file && req.file.path.startsWith("http")) {
      product.image = req.file.path; // secure_url from Cloudinary
    }

    await product.save();
    res.json(product);

  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
}


//delete product

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.image) {
      const publicId = extractPublicId(product.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
}

import Product from '../models/Product.js';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';

// Get all products
export async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
}

// Get product by ID
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
      discount,
      stock,
      manufacturer,
      description,
      prescription_status,
    } = req.body;
    
    let imageData = "";
     
    if (req.file) {
      imageData = req.file.path || req.file.location || req.file.secure_url || "";
    }

    const discount_price =
      price && discount
        ? price - (price * discount) / 100
        : price;
        
    const newProduct = new Product({
      name,
      category,
      price,
      discount,
      discount_price,
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

// Update product
export async function updateProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      discount,
      discount_price,
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
    product.discount = discount ?? product.discount;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;
    product.manufacturer = manufacturer ?? product.manufacturer;

    if (typeof prescription_status === 'string') {
      product.prescription_status = prescription_status === 'true';
    } else if (typeof prescription_status === 'boolean') {
      product.prescription_status = prescription_status;
    }
    

    // Recalculate discount_price
    const finalPrice = price ?? product.price;
    const finalDiscount = discount ?? product.discount;
    product.discount_price =
      finalPrice && finalDiscount
        ? finalPrice - (finalPrice * finalDiscount) / 100
        : finalPrice;
        

    // Update image
    if (req.file && req.file.path.startsWith("http")) {
      product.image = req.file.path;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
}

// Delete product
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


//get product by category id
export async function getProductsByCat(req, res) {
  try {
    const id = req.params.id;

    const products = await Product.find({ category: id });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this category." });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by category", error: error.message });
  }
}
import Product from '../models/Product.js';
import Offer from '../models/offers.js';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';

// Helper: apply active offer to product
async function applyActiveOfferToProduct(product) {
  const offers = await Offer.find({ status: "active" }).populate("products");

  for (const offer of offers) {
    const matchedProduct = offer.products.find(
      (p) => p._id.toString() === product._id.toString()
    );
    if (matchedProduct) {
      const discount = offer.discount;
      const discountedPrice = Math.round((product.price * (1 - discount / 100)) * 100) / 100;
      const updatedProduct = product.toObject();
      updatedProduct.discount = discount;
      updatedProduct.discount_price = discountedPrice;
      return updatedProduct;
    }
  }

  return product.toObject(); // no offer, return as is
}

// Helper: apply offers to an array of products
async function applyOffersToProducts(products) {
  const offers = await Offer.find({ status: "active" }).populate("products");
  return products.map(product => {
    let updatedProduct = product.toObject();
    for (const offer of offers) {
      const matched = offer.products.find(p => p._id.toString() === product._id.toString());
      if (matched) {
        const discount = offer.discount;
        updatedProduct.discount = discount;
        updatedProduct.discount_price = Math.round((product.price * (1 - discount / 100)) * 100) / 100;
        return updatedProduct;
      }
    }
    return updatedProduct;
  });
}

// Get all products
export async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    const updatedProducts = await applyOffersToProducts(products);
    res.json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
}

// Get product by ID
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updatedProduct = await applyActiveOfferToProduct(product);
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
}

// Create new product
export async function createProduct(req, res) {
  try {
    const {
      name,
      category,
      subcategory,
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
      price && discount ? price - (price * discount) / 100 : price;

    const newProduct = new Product({
      name,
      category,
      subcategory,
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
      stock,
      category,
      subcategory,
      prescription_status,
      manufacturer,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

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
    product.subcategory = subcategory ?? product.subcategory;
    product.manufacturer = manufacturer ?? product.manufacturer;

    if (typeof prescription_status === 'string') {
      product.prescription_status = prescription_status === 'true';
    } else if (typeof prescription_status === 'boolean') {
      product.prescription_status = prescription_status;
    }

    const finalPrice = price ?? product.price;
    const finalDiscount = discount ?? product.discount;
    product.discount_price =
      finalPrice && finalDiscount
        ? finalPrice - (finalPrice * finalDiscount) / 100
        : finalPrice;

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

// Get products by category ID
export async function getProductsByCat(req, res) {
  try {
    const id = req.params.id;
    const products = await Product.find({ category: id });
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this category." });
    }

    const updatedProducts = await applyOffersToProducts(products);
    res.status(200).json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by category", error: error.message });
  }
}

// Get products by subcategory
export async function getProductsBySubCategory(req, res) {
  try {
    const subCategoryId = req.params.id;
    const products = await Product.find({ subcategory: subCategoryId });

    const updatedProducts = await applyOffersToProducts(products);
    res.status(200).json(updatedProducts);
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
}

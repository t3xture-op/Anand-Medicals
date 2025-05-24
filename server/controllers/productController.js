import Product from '../models/Product.js';


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
export async function getProductById(req,res){
    try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
}

// Create new product (admin only)
export async function createProduct(req, res) {
  try {
    const { name, description, price } = req.body;
    const image = req.file;

    const product = new Product({
      name,
      description,
      price,
      image: {
        url: image.path,
        public_id: image.filename,
      },
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
}


//update product
import { cloudinary } from '../middlewares/cloudinary.js';

export async function updateProduct(req, res) {
  try {
    const { name, description, price } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete old image if new one is uploaded
    if (req.file && product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;

    if (req.file) {
      product.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
}



//delete product
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
}

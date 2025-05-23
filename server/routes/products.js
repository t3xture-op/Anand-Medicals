import express from 'express';
import { getAllProducts,getProductById,createProduct,updateProduct,deleteProduct } from '../controllers/productController.js';


const productRouter = express.Router();

// Get all products
productRouter.get('/',getAllProducts)


// Get product by ID
productRouter.get('/:id',getProductById)


// Create new product (admin only)
productRouter.post('/',createProduct)


// Update product (admin only)
productRouter.put('/:id',updateProduct)

// Delete product (admin only)
productRouter.delete('/:id',deleteProduct)

export default productRouter;
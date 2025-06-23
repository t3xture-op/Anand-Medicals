import express from 'express';
import multer from 'multer';
import { getAllProducts,getProductById,createProduct,updateProduct,deleteProduct ,getProductsByCat ,getProductsBySubCategory} from '../controllers/productController.js';
import { uploadProduct } from '../middlewares/cloudinary.js';

const upload = multer({ dest: "uploads/" });
const productRouter = express.Router();

// Get all products
productRouter.get('/',getAllProducts)


// Get product by ID
productRouter.get('/:id',getProductById)


// Create new product (admin only)
productRouter.post('/admin/add', uploadProduct.single('image'), createProduct);


// Update product (admin only)
productRouter.put('/admin/edit/:id', uploadProduct.single('image'), updateProduct);

// Delete product (admin only)
productRouter.delete('/admin/delete/:id',deleteProduct)

//get product by category
productRouter.get('/category/:id',getProductsByCat );

//get products by subcategory
productRouter.get('/subcategory/:id', getProductsBySubCategory);

export default productRouter;
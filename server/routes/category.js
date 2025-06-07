import express from 'express'
import multer from 'multer';
import { getAllCategory,getCategoryById,createCategory,updateCategory,deleteCategory } from '../controllers/categoryController.js'
import { uploadCategory } from '../middlewares/cloudinary.js';

const categoryRouter = express.Router();
const upload = multer();

//Get all category
categoryRouter.get('/',getAllCategory)


//get category by id
categoryRouter.get('/:id',getCategoryById)


//create category(admin only)
categoryRouter.post('/add', uploadCategory.single('image'), createCategory);

//update category(admin only)
categoryRouter.put('/edit/:id', uploadCategory.single('image'),updateCategory)


//delete category(admin only)
categoryRouter.delete('/delete/:id',deleteCategory)

export default categoryRouter
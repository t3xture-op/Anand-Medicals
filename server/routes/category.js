import express from 'express'
import { getAllCategory,getCategoryById,createCategory,updateCategory,deleteCategory } from '../controllers/categoryController.js'

const categoryRouter = express.Router();

categoryRouter.get('/',getAllCategory)

categoryRouter.get('/:id',getCategoryById)

categoryRouter.post('/',createCategory)

categoryRouter.put('/:id',updateCategory)

categoryRouter.delete('/:id',deleteCategory)

export default categoryRouter
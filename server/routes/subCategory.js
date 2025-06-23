import express from 'express';
import {  getAllSubCategories,  addSubCategory,  deleteSubCategory,  updateSubCategory,  getSubCategoryById,} from '../controllers/subCategoryController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllSubCategories);
router.post('/admin/add',auth, addSubCategory);
router.delete('/admin/delete/:id',  deleteSubCategory);
router.put('/admin/edit/:id',auth,  updateSubCategory);
router.get('/:id', getSubCategoryById);

export default router;

import express from 'express';
import {  getAllSubCategories,  addSubCategory,  deleteSubCategory,  updateSubCategory,  getSubCategoryById,} from '../controllers/subCategoryController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllSubCategories);
router.post('/add',auth, addSubCategory);
router.delete('/delete/:id',  deleteSubCategory);
router.put('/edit/:id',auth,  updateSubCategory);
router.get('/:id', getSubCategoryById);

export default router;

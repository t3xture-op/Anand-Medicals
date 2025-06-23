import express from 'express';
import multer from 'multer';
import {  getAllBanners,  addBanner,  deleteBanner,} from '../controllers/bannerController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

const upload = multer({ dest: "uploads/" });


router.get('/', getAllBanners);
router.post('/admin/add', upload.single('image'), addBanner);
router.delete('/admin/:id', deleteBanner);

export default router;

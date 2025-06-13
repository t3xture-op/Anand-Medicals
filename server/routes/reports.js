import express from 'express';
import { getDashboardStats ,downloadReport } from '../controllers/reportsController.js';
import  auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/stats', auth, getDashboardStats);

router.get('/download', auth, downloadReport);

export default router;

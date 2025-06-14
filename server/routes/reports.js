import express from 'express';
import { getDashboardStats ,downloadReport, getOrdersReport, getProductsReport,getSalesDetails } from '../controllers/reportsController.js';
import  auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/stats', auth, getDashboardStats);

router.get('/download', auth, downloadReport);

router.get('/products-report', auth, getProductsReport);

router.get('/sales-details', auth, getSalesDetails);

router.get('/orders-report', auth, getOrdersReport);

export default router;

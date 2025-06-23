import express from 'express';
import { getDashboardStats ,downloadReport, getOrdersReport, getProductsReport,getSalesDetails } from '../controllers/reportsController.js';
import  auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/admin/stats', auth, getDashboardStats);

router.get('/admin/download', auth, downloadReport);

router.get('/admin/products-report', auth, getProductsReport);

router.get('/admin/sales-details', auth, getSalesDetails);

router.get('/admin/orders-report', auth, getOrdersReport);

export default router;

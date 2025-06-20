import express from 'express';
import { createRazorpayOrder } from '../controllers/paymentController.js';
import auth from '../middlewares/auth.js'



const router = express.Router();

router.post('/razorpay',auth, createRazorpayOrder);

export default router;

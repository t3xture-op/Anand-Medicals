// routes/authRoutes.js
import express from 'express';
import { refreshAccessToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/refresh', refreshAccessToken); 

export default router;

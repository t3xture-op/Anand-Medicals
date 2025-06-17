import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/user.js';
import categoryRoutes from './routes/category.js'
import cartRoutes from './routes/cart.js'
import addressRoutes from './routes/address.js';
import prescriptionRoutes from './routes/prescription.js'
import reportRoutes from './routes/reports.js'
import notificationRoutes from './routes/notification.js'
import cookieParser from 'cookie-parser';
import offerRoutes from './routes/offer.js';
import bannerRoutes from './routes/banner.js'
import subCategoryRoutes from './routes/subCategory.js'
import feedbackRoutes from './routes/feedback.js'
import paymentRoutes from './routes/paymentRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());

// Middleware


const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/cart',cartRoutes)
app.use('/api/address',addressRoutes)
app.use('/api/offer', offerRoutes);
app.use('/api/prescription',prescriptionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications',notificationRoutes);
app.use('/api/banner',bannerRoutes)
app.use('/api/subcategory', subCategoryRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/payment', paymentRoutes);


// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  app.use(express.static(join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
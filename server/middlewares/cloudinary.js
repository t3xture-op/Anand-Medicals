import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for product images
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Storage for category images
const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'category',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Middlewares for multer
const uploadProduct = multer({ storage: productStorage });
const uploadCategory = multer({ storage: categoryStorage });

export { cloudinary, uploadProduct, uploadCategory };

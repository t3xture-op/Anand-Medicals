// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';      
dotenv.config();

const auth = async (req, res, next) => {
  try {

    const token =
      req.cookies.accessToken ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Provide token' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // Fetch full user
    const user = await User.findById(decoded.id).select('name email role');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: error.message });
  }
};

export default auth;

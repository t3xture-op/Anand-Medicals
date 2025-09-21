import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';

dotenv.config();

const auth = async (req, res, next) => {
  try {
  
    const isAdminRoute =  req.originalUrl.includes('/admin');
    const accessCookieName = isAdminRoute ? 'adminAccessToken' : 'userAccessToken';
    const refreshCookieName = isAdminRoute ? 'adminRefreshToken' : 'userRefreshToken';

    const accessToken =
      req.cookies[accessCookieName] || req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies[refreshCookieName] || req.headers['x-refresh-token'];

    let decoded;

    // Try access token
    try {
      decoded = jwt.verify(accessToken, process.env.SECRET_KEY_ACCESS_TOKEN);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        // Access token expired – try refreshing
        if (!refreshToken) {
          return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }

        try {
          const decodedRefresh = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
          const user = await User.findById(decodedRefresh.id);

          if (!user || user.refresh_token !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
          }

          // Generate and set new access token
          const newAccessToken = await generatedAccessToken(user._id);
          res.cookie(accessCookieName, newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000, // 1 hour
          });

          decoded = jwt.verify(newAccessToken, process.env.SECRET_KEY_ACCESS_TOKEN);
        } catch (refreshErr) {
          console.error("Refresh token verification failed:", refreshErr);
          return res.status(403).json({ message: 'Session expired. Please log in again.' });
        }
      } else {
        return res.status(403).json({ message: 'Invalid token' });
      }
    }

    // Fetch user and attach to request
    const user = await User.findById(decoded.id).select('name email role image');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default auth;

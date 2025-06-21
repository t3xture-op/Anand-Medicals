import userModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generatedRefreshToken = async (userId) => {
  const user = await userModel.findById(userId);

  if (!user) throw new Error("User not found");

  const expiry = user.role === 'admin' ? '12h' : '30d';

  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: expiry,
  });

  await userModel.updateOne(
    { _id: userId },
    { refresh_token: token }
  );

  return token;
};

export default generatedRefreshToken;

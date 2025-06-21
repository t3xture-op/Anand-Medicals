import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel from '../models/User.js';

dotenv.config();

const generatedAccessToken = async (userId) => {
  const user = await userModel.findById(userId);

  if (!user) throw new Error("User not found");

  const expiry = user.role === 'admin' ? '15m' : '1h';

  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: expiry,
  });

  await userModel.updateOne(
    { _id: userId },
    { access_token: token }
  );

  return token;
};

export default generatedAccessToken;

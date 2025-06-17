import userModel from '../models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const generatedRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: "24h",
  });

  await userModel.updateOne(
    { _id: userId },
    { refresh_token: token }
  );

  return token; 
};

export default generatedRefreshToken
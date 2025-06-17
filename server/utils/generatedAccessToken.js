import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import userModel from '../models/User.js'

dotenv.config();

const generatedAccessToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: "24h",
  });

  await userModel.updateOne(
    { _id: userId },
    { access_token: token }
  );

  return token; 
};


export default generatedAccessToken
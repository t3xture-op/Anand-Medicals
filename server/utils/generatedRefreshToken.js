import userModel from '../models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const generatedRefreshToken = async(userId) =>{
    const token = await jwt.sign({id :userId},
    process.env.SECRET_KEY_REFRESH_TOKEN,
    {expiresIn: '30d'}
    )

    const updateRefershToken = await userModel.updateOne(
        {_id : userId},
        {
            refresh_token:token
        }
    )
    return updateRefershToken
}

export default generatedRefreshToken
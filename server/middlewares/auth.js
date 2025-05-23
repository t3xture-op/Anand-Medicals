import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1]

        if(!token)
        {
            return res.status(401).json({
                message : "provide token"
            })
        }

        const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)

        if(!decode)
        {
            return res.status(401).json({
                message : "unauthorised access"
            })
        }

        req.userId=decode.id
        next()
    } catch (error) {
        return res.status(500).json({
                message : error.message
            })
    }
}

export default auth
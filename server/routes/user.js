import express from 'express';
import { userRegistration,userLogin,forgotPassword,resetPassword,userLogout,verifyOtp,getAllUsers ,getUserId} from "../controllers/userController.js";
import auth from '../middlewares/auth.js'

const userRouter = express.Router();

userRouter.post('/register',userRegistration)
userRouter.post('/login',userLogin)
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/reset-password',resetPassword)
userRouter.post('/verify-otp',verifyOtp)
userRouter.get('/logout',auth,userLogout)
userRouter.get('/get',getAllUsers)
userRouter.get('/get/:id',getUserId)


export default userRouter;
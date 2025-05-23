import express from 'express';
import { userRegistration,userLogin,forgotPassword,resetPassword,userLogout} from "../controllers/userController.js";
import auth from '../middlewares/auth.js'

const userRouter = express.Router();

userRouter.post('/register',userRegistration)
userRouter.post('/login',userLogin)
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/reset-password',resetPassword)
userRouter.get('/logout',auth,userLogout)


export default userRouter;
import express from 'express';
import multer from "multer";
import { userRegistration,userLogin,forgotPassword,resetPassword,userLogout,verifyOtp,getAllUsers ,getUserId,updateProfile,uploadProfilePhoto,deleteProfilePhoto,changePassword} from "../controllers/userController.js";
import auth from '../middlewares/auth.js'

const userRouter = express.Router();
const upload = multer({ dest: "uploads/" });

userRouter.post('/register',userRegistration)
userRouter.post('/login',userLogin)
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/reset-password',resetPassword)
userRouter.post('/verify-otp',verifyOtp)
userRouter.get('/logout',auth,userLogout)
userRouter.get('/get',getAllUsers)
userRouter.get('/get/:id',getUserId)
userRouter.put('/profile', auth, updateProfile);
userRouter.post('/upload-profile', auth, uploadProfilePhoto);
userRouter.delete('/delete-profile-photo', auth, deleteProfilePhoto);
userRouter.put('/change-password', auth, changePassword);


export default userRouter;
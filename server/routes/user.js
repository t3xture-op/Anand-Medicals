import express from 'express';
import multer from "multer";
import { userRegistration ,userLogin ,forgotPassword ,resetPassword ,userLogout ,verifyOtp ,getAllUsers ,getUserId ,updateProfile ,getCurrentUser ,uploadProfilePhoto ,deleteProfilePhoto ,changePassword ,getMyProfile ,verifyAccount ,verifyAccountOtp} from "../controllers/userController.js";
import auth from '../middlewares/auth.js'
import { uploadUser } from '../middlewares/cloudinary.js';

const userRouter = express.Router();
const upload = multer({ dest: "uploads/" });

userRouter.post('/register',userRegistration)
userRouter.post('/login',userLogin)
userRouter.get('/am', getCurrentUser);
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/reset-password',resetPassword)
userRouter.post('/verify-otp',verifyOtp)
userRouter.post('/verify-account',verifyAccount)
userRouter.post('/verify-account-otp',verifyAccountOtp)
userRouter.get('/logout',auth,userLogout)
userRouter.get('/get',getAllUsers)
userRouter.get('/get/:id',getUserId)
userRouter.put('/update-profile', auth, updateProfile);
userRouter.post('/upload-profile-photo',auth, uploadUser.single('image'), uploadProfilePhoto);
userRouter.delete('/delete-profile-photo', auth, deleteProfilePhoto);
userRouter.put('/change-password', auth, changePassword);
userRouter.get("/me",auth,getMyProfile)



export default userRouter;
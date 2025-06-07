import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import { match } from 'assert';


//register a user
export async function userRegistration(req,res){
    try {
        const { email, password, name } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
    
        const user = new User({ email, password, name });
        await user.save();
    
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
    
        res.status(201).json({ token });
      } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
      }
}


//login user
export async function userLogin(req,res){
 try {
 
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if(user.status!=="Active"){
      return res.status(400).json({
        message:"Contact Admin"
      })
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );


    const accessToken = await generatedAccessToken(user._id)
    const refreshToken= await generatedRefreshToken(user._id)
    
    const updateUser = await User.findByIdAndUpdate(user?._id,{
      last_login_date:new Date()
    })

    const cookiesOption = {
      httpOnly : true,
      secure : true,
      sameSite : "None"
    }

    res.cookie('accessToken',accessToken,cookiesOption)
    res.cookie('refreshToken',refreshToken,cookiesOption)

    return res.json({
      message:"logined succesfully",
      data:{
        accessToken,
        refreshToken,
        user: {
         name: user.name,
         email: user.email,
         role:user.role
        }
      }
    })
    
  } catch (error) {
    res.status(500).json({ message: 'Error logging in',error: error.message });
  }
}

//logout

export async function userLogout(req,res){
  try {
    const userid = req.userId

     const cookiesOption = {
      httpOnly : true,
      secure : true,
      sameSite : "None"
    }
    res.clearCookie("accesToken",cookiesOption)
    res.clearCookie("refreshToken",cookiesOption)

    const removeRefreshToken = await User.findByIdAndUpdate(userid,{
      refresh_token : ""
    })

    return res.json({
      message : "Logout sucessfull"
    })

    
  } catch (error) {
    return response.status(500).json({
      message:error.message
    })
  }
}


//forgot password
export async function forgotPassword(req,res){
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        
        // Save OTP to database
        const passwordReset = new PasswordReset({
          user: user._id,
          otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });
        await passwordReset.save();
    
        // Send OTP via email
        await sendPasswordResetEmail(email,otp);
    
        res.json({ message: 'Password reset OTP sent to your email' });
      } catch (error) {
        res.status(500).json({ message: 'Error sending password reset OTP' });
      }
}


//verify otp
export async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordReset = await PasswordReset.findOne({
      user: user._id,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!passwordReset) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

  
    passwordReset.isUsed = true;
    await passwordReset.save();

    res.status(200).json({ message: 'OTP verified' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}


//reset password
export async function resetPassword(req,res){
 try {
    const { email,newPassword,confirmNewPass } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

      user.password = newPassword;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
}
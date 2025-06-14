import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import { notificationEmitter } from "../routes/notification.js";
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';
import bcrypt from 'bcryptjs';

//register a user
export async function userRegistration(req, res) {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ email, password, name });
    await user.save();

    const notification = new Notification({
      title: "New User Registered",
      message: `Welcome ${user.name} to the platform.`,
      type: "user",
      targetId: user._id, // <- required field
    });
    const savedNotification = await notification.save();

    notificationEmitter.emit("newNotif", savedNotification);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
}

//login user
export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact Admin",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const updateUser = await User.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.json({
      message: "logined succesfully",
      data: {
        accessToken,
        refreshToken,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
}

//logout

export async function userLogout(req, res) {
  try {
    const userid = req.user._id;

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accesToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await User.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return res.json({
      message: "Logout sucessfull",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
    });
  }
}

//forgot password
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP to database
    const passwordReset = new PasswordReset({
      user: user._id,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });
    await passwordReset.save();

    // Send OTP via email
    await sendPasswordResetEmail(email, otp);

    res.json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending password reset OTP" });
  }
}

//verify otp
export async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordReset = await PasswordReset.findOne({
      user: user._id,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!passwordReset) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    passwordReset.isUsed = true;
    await passwordReset.save();

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

//reset password
export async function resetPassword(req, res) {
  try {
    const { email, newPassword, confirmNewPass } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
}


//get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find({ role: "user" });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}


//get user by id
export async function getUserId(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get user's orders
    const userOrders = await Order.find({ user: req.params.id });

    res.status(200).json({ user, orders: userOrders });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}


//update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, gender, dob } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, gender, dob },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
//upload photo

export const uploadProfilePhoto = async (req, res) => {
  try {
    // Use multer or cloudinary file upload
    const imageUrl = req.body.image; // Assume Cloudinary link from frontend
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imageUrl },
      { new: true }
    );
    res.json({ message: 'Profile photo updated', image: updated.profileImage });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload profile photo' });
  }
};

//delete photo
export const deleteProfilePhoto = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: '' },
      { new: true }
    );
    res.json({ message: 'Profile photo removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete profile photo' });
  }
};

//change password from profile

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password' });
  }
};
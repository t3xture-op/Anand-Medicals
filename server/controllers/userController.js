import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import { sendPasswordResetEmail ,sendAccountVerificationEmail} from "../utils/emailService.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import { notificationEmitter } from "../routes/notification.js";
import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";

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

    res.status(201).json({ user });
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
          image: user.image,
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



//verify account
export const verifyAccount = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    sendAccountVerificationEmail(email,otp)

    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};


//verify otp for account verification
export const verifyAccountOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
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
    res.json({ message:'user registration success' });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

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

//get user by id(admin)

export async function getUserId(req, res) {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const orders = await Order.find({ user: req.params.id }).lean();

    const totalOrders = orders.length;
    const activeOrders = orders.filter(
      (o) => o.status !== "cancelled" && o.status !== "delivered"
    ).length;
    const cancelledOrders = orders.filter(
      (o) => o.status === "cancelled"
    ).length;
    const deliveredOrders = orders.filter(
      (o) => o.status === "delivered"
    ).length;
    const totalSpent = orders
      .filter((o) => o.paymentStatus === "completed")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      user,
      orders,
      stats: {
        totalOrders,
        activeOrders,
        cancelledOrders,
        deliveredOrders,
        totalSpent,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user details" });
  }
}

//update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, dob } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, dob },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

//upload photo
export async function uploadProfilePhoto(req, res) {
  try {
    const userId = req.user._id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = req.file.path;

    // ✅ Correct field name: "image"
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: imageUrl },
      { new: true }
    );

    res.status(200).json({
      message: "Profile photo uploaded successfully",
      imageUrl: updatedUser.image, // Match your schema
    });
  } catch (error) {
    console.error("Upload Profile Photo Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

//delete photo

export const deleteProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const imageUrl = user.image;

    // Delete from Cloudinary only if there's an existing image
    if (imageUrl) {
      const publicId = extractPublicId(imageUrl);
      await cloudinary.uploader.destroy(publicId);
    }

    // Remove image reference from DB
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { image: "" },
      { new: true }
    );

    res.json({ message: "Profile photo removed", image: updated.image });
  } catch (err) {
    console.error("Cloudinary Delete Error:", err);
    res.status(500).json({ message: "Failed to delete profile photo" });
  }
};

//change password from profile

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ message: "Error changing password" });
  }
};

//get user for user
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; // populated by auth middleware
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      id: user._id,
      name: user.name,
      image: user.image,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

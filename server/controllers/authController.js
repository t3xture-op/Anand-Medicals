import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.userRefreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY_ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    res.cookie("userAccessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      user,
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};


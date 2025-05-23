import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const port = Number(process.env.SMTP_PORT);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure:  true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendPasswordResetEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Anand Medicals" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2B8A3E;">Password Reset Request</h2>
        <p>You have requested to reset your password. Use the following OTP to proceed:</p>
        <div style="background-color: #F1F3F5; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #2B8A3E; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p style="color: #868E96; font-size: 12px; margin-top: 20px;">
          This is an automated email, please do not reply.
        </p>
      </div>
    `
  };

    
    await transporter.sendMail(mailOptions);

};

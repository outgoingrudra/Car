import nodemailer from "nodemailer";
import { bookingConfirmationMessage } from "../emails/bookingConfirmation.js";

export const mailIsConfigured = () => Boolean(
  process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_APP_PASSWORD?.trim()
);

const sendEmail = async (message) => {
  if (!mailIsConfigured()) throw new Error("Gmail is not configured");

  const adminEmail = process.env.ADMIN_EMAIL.trim();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: adminEmail,
      pass: process.env.ADMIN_APP_PASSWORD.replace(/\s/g, "")
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });

  await transporter.sendMail({
    from: adminEmail,
    ...message
  });
};

export const sendVerificationEmail = (email, code) => sendEmail({
  to: email,
  subject: "Your Car Rental verification code",
  text: `Your verification code is ${code}. It expires in 10 minutes. If you did not sign up, ignore this email.`
});

export const sendEmailChangeCode = (email, code) => sendEmail({
  to: email,
  subject: "Confirm your new Car Rental email",
  text: `Enter ${code} in your Car Rental account settings to confirm this email address. It expires in 10 minutes. If you did not request this change, ignore this email.`
});

export const sendPasswordResetEmail = (email, code) => sendEmail({
  to: email,
  subject: "Reset your Car Rental password",
  text: `Your password reset code is ${code}. It expires in 10 minutes. If you did not request a reset, ignore this email. Your password has not changed.`,
  html: `<div style="background:#f1f5f9;padding:32px 16px;font-family:Arial,sans-serif"><div style="max-width:480px;margin:auto;background:white;border-radius:12px;padding:32px"><p style="color:#2563eb;font-weight:bold">CAR RENTAL</p><h1 style="color:#132a4a;font-size:24px">Reset your password</h1><p style="color:#526176;line-height:1.6">Enter this code in the app to choose a new password.</p><p style="background:#eff6ff;padding:20px;text-align:center;font-size:32px;letter-spacing:8px;font-weight:bold;color:#132a4a">${code}</p><p style="color:#526176;font-size:14px;line-height:1.6">This code expires in 10 minutes. If you did not request a reset, ignore this email. Your password has not changed.</p></div></div>`
});

export const sendBookingConfirmationEmail = (booking) => {
  if (!booking.user?.email) throw new Error("Renter email is unavailable");
  return sendEmail({ to: booking.user.email, ...bookingConfirmationMessage(booking) });
};

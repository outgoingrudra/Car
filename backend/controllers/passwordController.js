import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { mailIsConfigured, sendPasswordResetEmail } from "../configs/mailer.js";

const normalize = (value) => typeof value === "string" ? value.trim().toLowerCase() : "";
const hashCode = (email, code) => createHmac("sha256", process.env.JWT_SECRET).update(`password-reset:${email}:${code}`).digest("hex");
const requestMessage = "If an account exists, a reset code has been sent. Check your inbox and spam folder.";

export async function forgotPassword(req, res) {
  const email = normalize(req.body?.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address" });
  try {
    if (!mailIsConfigured()) return res.status(503).json({ success: false, message: "Email is temporarily unavailable" });
    const code = String(randomInt(0, 1000000)).padStart(6, "0");
    const hash = hashCode(email, code);
    const user = await User.findOneAndUpdate({ email,
      $or: [{ resetCodeSentAt: { $exists: false } }, { resetCodeSentAt: { $lte: new Date(Date.now() - 60000) } }]
    }, { $set: { resetCodeHash: hash, resetCodeExpiresAt: new Date(Date.now() + 600000), resetCodeSentAt: new Date(), resetCodeAttempts: 0 } }, { new: true });
    if (user) {
      try { await sendPasswordResetEmail(user.email, code); }
      catch {
        await User.updateOne({ _id: user._id, resetCodeHash: hash }, { $unset: { resetCodeHash: "", resetCodeExpiresAt: "", resetCodeSentAt: "", resetCodeAttempts: "" } });
        return res.status(503).json({ success: false, message: "Could not send the reset email. Please retry." });
      }
    }
    res.json({ success: true, message: requestMessage });
  } catch {
    res.status(503).json({ success: false, message: "Password reset is temporarily unavailable" });
  }
}

export async function resetPassword(req, res) {
  const email = normalize(req.body?.email);
  const { code, password } = req.body || {};
  if (!email || typeof code !== "string" || !/^\d{6}$/.test(code) || typeof password !== "string" || password.length < 8 || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ success: false, message: "Enter the six digit code and a password of at least 8 characters (maximum 72 bytes)" });
  }
  const invalid = () => res.status(400).json({ success: false, message: "Code incorrect, expired, or used. Request a new code if needed." });
  try {
    // Consume an attempt atomically, including concurrent guesses.
    const user = await User.findOneAndUpdate({ email, resetCodeHash: { $exists: true },
      resetCodeExpiresAt: { $gt: new Date() }, resetCodeAttempts: { $lt: 5 }
    }, { $inc: { resetCodeAttempts: 1 } }, { new: true }).select("+resetCodeHash");
    if (!user) return invalid();
    const expected = Buffer.from(user.resetCodeHash, "hex");
    const supplied = Buffer.from(hashCode(email, code), "hex");
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return invalid();
    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await User.findOneAndUpdate({ _id: user._id, resetCodeHash: user.resetCodeHash,
      resetCodeExpiresAt: { $gt: new Date() }, resetCodeAttempts: { $lte: 5 }
    }, { $set: { password: hashedPassword }, $inc: { tokenVersion: 1 }, $unset: {
      resetCodeHash: "", resetCodeExpiresAt: "", resetCodeSentAt: "", resetCodeAttempts: ""
    } }, { new: true });
    if (!updated) return invalid();
    res.json({ success: true, message: "Password changed. Please log in with your new password." });
  } catch {
    res.status(500).json({ success: false, message: "Could not reset password. Please try again." });
  }
}

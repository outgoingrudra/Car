import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import multer from "multer";
import User from "../models/user.js";
import { mailIsConfigured, sendEmailChangeCode } from "../configs/mailer.js";

export const profileUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 }, fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith("image/")) }).single("image");
const hashCode = (id, email, code) => createHmac("sha256", process.env.JWT_SECRET).update(`${id}:${email}:${code}`).digest("hex");
const publicUser = (user) => ({ _id: user._id, name: user.name, email: user.email, image: user.image, role: user.role, isEmailVerified: user.isEmailVerified });

export async function updateProfile(req, res) {
  try {
    const name = req.body.name?.trim();
    if (!name || name.length > 80) return res.status(400).json({ success: false, message: "Enter a name of up to 80 characters" });
    const fields = { name };
    if (req.file) {
      const { default: imagekit } = await import("../configs/imagekit.js");
      const uploaded = await imagekit.upload({ file: req.file.buffer, fileName: req.file.originalname, folder: "/profiles" });
      fields.image = imagekit.url({ path: uploaded.filePath, transformation: [{ width: "320", height: "320", quality: "auto", format: "webp" }] });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { $set: fields }, { new: true });
    res.json({ success: true, user: publicUser(user), message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not update profile" });
  }
}

export async function requestEmailChange(req, res) {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email === req.user.email) return res.status(400).json({ success: false, message: "Enter a different valid email" });
    if (!mailIsConfigured()) return res.status(503).json({ success: false, message: "Email delivery is not configured" });
    if (await User.exists({ email, _id: { $ne: req.user._id } })) return res.status(409).json({ success: false, message: "Email is already in use" });
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const now = new Date();
    const user = await User.findOneAndUpdate({ _id: req.user._id, $or: [{ emailChangeSentAt: { $exists: false } }, { emailChangeSentAt: { $lte: new Date(Date.now() - 60_000) } }] }, { $set: { pendingEmail: email, emailChangeCodeHash: hashCode(req.user._id, email, code), emailChangeExpiresAt: new Date(Date.now() + 600_000), emailChangeSentAt: now, emailChangeAttempts: 0 } });
    if (!user) return res.status(429).json({ success: false, message: "Wait a minute before requesting another code" });
    try { await sendEmailChangeCode(email, code); }
    catch (error) { await User.updateOne({ _id: req.user._id, pendingEmail: email }, { $unset: { pendingEmail: "", emailChangeCodeHash: "", emailChangeExpiresAt: "", emailChangeSentAt: "" } }); throw error; }
    res.json({ success: true, message: "Verification code sent to the new email" });
  } catch (error) { res.status(503).json({ success: false, message: "Could not send the verification email" }); }
}

export async function confirmEmailChange(req, res) {
  const code = typeof req.body.code === "string" ? req.body.code.trim() : "";
  if (!/^\d{6}$/.test(code)) return res.status(400).json({ success: false, message: "Enter the six digit code" });
  const user = await User.findById(req.user._id).select("+pendingEmail +emailChangeCodeHash +emailChangeExpiresAt +emailChangeAttempts");
  if (!user?.pendingEmail || !user.emailChangeCodeHash || user.emailChangeExpiresAt <= new Date() || user.emailChangeAttempts >= 5) return res.status(400).json({ success: false, message: "Code expired. Request a new one." });
  const expected = Buffer.from(user.emailChangeCodeHash, "hex");
  const supplied = Buffer.from(hashCode(user._id, user.pendingEmail, code), "hex");
  if (!timingSafeEqual(expected, supplied)) { await User.updateOne({ _id: user._id, emailChangeCodeHash: user.emailChangeCodeHash }, { $inc: { emailChangeAttempts: 1 } }); return res.status(400).json({ success: false, message: "Incorrect code" }); }
  try {
    const updated = await User.findOneAndUpdate({ _id: user._id, emailChangeCodeHash: user.emailChangeCodeHash, emailChangeExpiresAt: { $gt: new Date() }, emailChangeAttempts: { $lt: 5 } }, { $set: { email: user.pendingEmail }, $unset: { pendingEmail: "", emailChangeCodeHash: "", emailChangeExpiresAt: "", emailChangeSentAt: "", emailChangeAttempts: "" } }, { new: true });
    if (!updated) return res.status(400).json({ success: false, message: "Code expired. Request a new one." });
    res.json({ success: true, user: publicUser(updated), message: "Email updated" });
  } catch (error) { res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "Email is already in use" : "Could not update email" }); }
}

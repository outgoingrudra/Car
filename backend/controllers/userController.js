import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js"
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { mailIsConfigured, sendVerificationEmail } from "../configs/mailer.js";

const codeHash = (email, code) => createHmac("sha256", process.env.JWT_SECRET)
  .update(`${email}:${code}`).digest("hex");

const sendCode = async (user) => {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const hash = codeHash(user.email, code);
  if (user.isNew) await user.save();
  const claimed = await User.findOneAndUpdate({
    _id: user._id, isEmailVerified: false,
    $or: [{ verificationCodeSentAt: { $exists: false } },
      { verificationCodeSentAt: { $lte: new Date(Date.now() - 60_000) } }]
  }, { $set: {
    verificationCodeHash: hash,
    verificationCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    verificationCodeSentAt: new Date(), verificationCodeAttempts: 0
  } }, { new: true });
  if (!claimed) throw Object.assign(new Error("Please wait a minute before requesting another code"), { status: 429 });
  try {
    await sendVerificationEmail(user.email, code);
  } catch (error) {
    // Allow an immediate retry when the mail server was unavailable.
    await User.updateOne({ _id: user._id, verificationCodeHash: hash }, { $unset: {
      verificationCodeSentAt: "", verificationCodeHash: "", verificationCodeExpiresAt: ""
    } });
    throw error;
  }
};

// generate token function

const generateToken = (user) => {
  return jwt.sign({ sub: user._id.toString(), version: user.tokenVersion || 0 }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (typeof name !== "string" || !name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ success: false, message: "Enter a name, valid email and password of at least 8 characters" });
    }
    if (!mailIsConfigured()) {
      return res.status(503).json({ success: false, message: "Add ADMIN_EMAIL and ADMIN_APP_PASSWORD to backend/.env" });
    }

    let user = await User.findOne({ email: normalizedEmail }).select("+verificationCodeSentAt");
    if (user?.isEmailVerified !== false && user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    if (user?.verificationCodeSentAt && Date.now() - user.verificationCodeSentAt.getTime() < 60_000) {
      return res.status(429).json({ success: false, message: "Please wait a minute before requesting another code" });
    }
    if (user) {
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(409).json({ success: false, message: "An account already exists. Log in to finish email verification." });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name: name.trim(), email: normalizedEmail, password: hashedPassword, isEmailVerified: false });
    }
    await sendCode(user);
    res.status(201).json({ success: true, requiresVerification: true, message: "Verification code sent to your email" });
  } catch (error) {
    if (error.status === 429) return res.status(429).json({ success: false, message: error.message });
    if (error.code === 11000) return res.status(409).json({ success: false, message: "An account already exists. Please log in." });
    console.error("Registration email error:", error);
    res.status(503).json({ success: false, message: "Could not send the verification email. Please try again." });
  }
};

export const resendVerificationCode = async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    const user = await User.findOne({ email, isEmailVerified: false }).select("+verificationCodeSentAt");
    if (!user) return res.status(404).json({ success: false, message: "Pending account not found" });
    if (user.verificationCodeSentAt && Date.now() - user.verificationCodeSentAt.getTime() < 60_000) {
      return res.status(429).json({ success: false, message: "Please wait a minute before requesting another code" });
    }
    await sendCode(user);
    res.json({ success: true, message: "A new code was sent" });
  } catch (error) {
    if (error.status === 429) return res.status(429).json({ success: false, message: error.message });
    console.error("Resend verification error:", error);
    res.status(503).json({ success: false, message: "Could not send the verification email" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const code = typeof req.body.code === "string" ? req.body.code.trim() : "";
    if (!email || !/^\d{6}$/.test(code || "")) {
      return res.status(400).json({ success: false, message: "Enter the six digit code" });
    }
    const user = await User.findOne({ email, isEmailVerified: false })
      .select("+verificationCodeHash +verificationCodeExpiresAt +verificationCodeAttempts");
    if (!user || !user.verificationCodeHash || user.verificationCodeExpiresAt <= new Date() || user.verificationCodeAttempts >= 5) {
      return res.status(400).json({ success: false, message: "Code expired or unavailable. Request a new code." });
    }
    const expected = Buffer.from(user.verificationCodeHash, "hex");
    const supplied = Buffer.from(codeHash(email, code), "hex");
    if (!timingSafeEqual(expected, supplied)) {
      await User.updateOne({ _id: user._id, isEmailVerified: false, verificationCodeHash: user.verificationCodeHash }, { $inc: { verificationCodeAttempts: 1 } });
      return res.status(400).json({ success: false, message: "Incorrect code" });
    }
    const verified = await User.findOneAndUpdate(
      { _id: user._id, isEmailVerified: false, verificationCodeHash: user.verificationCodeHash,
        verificationCodeExpiresAt: { $gt: new Date() }, verificationCodeAttempts: { $lt: 5 } },
      { $set: { isEmailVerified: true }, $unset: {
        verificationCodeHash: "", verificationCodeExpiresAt: "", verificationCodeSentAt: "", verificationCodeAttempts: ""
      } },
      { new: true }
    );
    if (!verified) return res.status(400).json({ success: false, message: "Code expired or unavailable. Request a new code." });
    res.json({ success: true, token: generateToken(verified), message: "Email verified" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ success: false, message: "Could not verify email" });
  }
};


// login user
export const loginUser = async (req, res) => {
  try {
    const { password } = req.body;
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!email || typeof password !== "string" || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all fields" });
    }       
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .json({ success: false, message: "User does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .json({ success: false, message: "Invalid credentials" });
    }   
    if (user.isEmailVerified === false) {
      return res.status(403).json({ success: false, requiresVerification: true, message: "Verify your email to log in" });
    }
    const token = generateToken(user);
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ success: false, message: error.message });
  } 
};

// get user details using token

export const getUserData = async (req, res) => {
  try {
    const {user} = req;
    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.send({ success: false, message: error.message });
  }
};

// get all car
export const getCars = async(req,res)=>{
  
  try {
    const cars = await Car.find({isAvailable:true})
    res.status(200).json({success:true , cars}) // Add status 200
  } catch (error) {
    console.log(error.message)
    res.status(500).json({success:false , message:error.message}) // Add status 500
  }
}

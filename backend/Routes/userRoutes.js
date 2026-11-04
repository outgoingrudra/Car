import express from "express"
import { getCars, getUserData, registerUser, resendVerificationCode, verifyEmail } from "../controllers/userController.js";
import { loginUser } from "../controllers/userController.js";
import {protect} from "../middleware/auth.js"
import { forgotPassword, resetPassword } from "../controllers/passwordController.js";
import { updateProfile, requestEmailChange, confirmEmailChange, profileUpload } from "../controllers/profileController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser); 
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resend-verification", resendVerificationCode);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/data",protect,getUserData)
userRouter.patch("/profile", protect, profileUpload, updateProfile);
userRouter.post("/email-change", protect, requestEmailChange);
userRouter.post("/email-change/verify", protect, confirmEmailChange);
userRouter.get("/cars",getCars)


export default userRouter;

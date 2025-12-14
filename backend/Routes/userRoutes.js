import express from "express"
import { registerUser } from "../controllers/userController";
import { loginUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/register", registerUser); 
userRouter.post("/login", loginUser);


export default userRouter;
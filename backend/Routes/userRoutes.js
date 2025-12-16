import express from "express"
import { getUserData, registerUser } from "../controllers/userController.js";
import { loginUser } from "../controllers/userController.js";
import {protect} from "../middleware/auth.js"

const userRouter = express.Router();

userRouter.post("/register", registerUser); 
userRouter.post("/login", loginUser);
userRouter.get("/data",protect,getUserData)


export default userRouter;
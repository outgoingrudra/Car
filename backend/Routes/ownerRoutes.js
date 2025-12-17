import express from "express";
import { changeRoleToOwner, getDashboardData, getOwnerCars } from "../controllers/ownerController.js";
import {protect} from "../middleware/auth.js"
import upload from "../middleware/multer.js"
import { addCar } from "../controllers/ownerController.js";
const ownerRouter = express.Router();

ownerRouter.post("/change-role",protect , changeRoleToOwner);
ownerRouter.post("/add-car",upload.single("image"), addCar);
ownerRouter.post("/cars",protect , getOwnerCars)
ownerRouter.post()

export default ownerRouter;
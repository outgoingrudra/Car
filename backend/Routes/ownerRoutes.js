import express from "express";
import { changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability } from "../controllers/ownerController.js";
import {protect} from "../middleware/auth.js"
import upload from "../middleware/multer.js"
import { addCar } from "../controllers/ownerController.js";
const ownerRouter = express.Router();

ownerRouter.post("/change-role",protect , changeRoleToOwner);
ownerRouter.post("/add-car",upload.single("image"), addCar);
ownerRouter.post("/cars",protect , getOwnerCars)
ownerRouter.post("/toggle-car",protect , toggleCarAvailability)
ownerRouter.post("/delete-car",protect , deleteCar)


export default ownerRouter;
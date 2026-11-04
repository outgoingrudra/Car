import express from "express";
import { changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controllers/ownerController.js";
import {protect} from "../middleware/auth.js"
import upload from "../middleware/multer.js"
import { addCar } from "../controllers/ownerController.js";
import { editCarUpload, loadOwnedCar, updateCar } from "../controllers/carEditingController.js";
const ownerRouter = express.Router();

ownerRouter.post("/change-role",protect , changeRoleToOwner);
ownerRouter.post("/add-car",protect, upload.single("image"), addCar);
ownerRouter.get("/cars",protect , getOwnerCars)
ownerRouter.get("/cars/:id", protect, loadOwnedCar, (req, res) => res.json({ success: true, car: req.car }));
ownerRouter.patch("/cars/:id", protect, loadOwnedCar, editCarUpload, updateCar);
ownerRouter.post("/toggle-car",protect , toggleCarAvailability)
ownerRouter.post("/delete-car",protect , deleteCar)
ownerRouter.get("/dashboard",protect , getDashboardData)
ownerRouter.post("/update-image",upload.single("image"),protect,updateUserImage)



export default ownerRouter;

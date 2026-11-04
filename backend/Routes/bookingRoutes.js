import express from 'express';
import {cancelBooking, changeBookingStatus, checkCarAvailability, createBooking, getOwnerBookings, getUserBookings, retryConfirmationEmail} from '../controllers/bookingController.js'
import {protect} from "../middleware/auth.js"


const  bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkCarAvailability)
bookingRouter.post("/create",protect,createBooking)
bookingRouter.get("/user",protect,getUserBookings)
bookingRouter.patch("/:id/cancel",protect,cancelBooking)
bookingRouter.get("/owner",protect,getOwnerBookings)
bookingRouter.post("/change-status",protect,changeBookingStatus)
bookingRouter.post("/:id/confirmation-email", protect, retryConfirmationEmail)

export default bookingRouter;

import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// Helper function to check car availability
const checkAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        pickupDate: { $lt: returnDate },
        returnDate: { $gt: pickupDate }
    });

    return bookings.length === 0;
}


// Helper function to validate dates
const validateDates = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    // Check if dates are valid
    if (isNaN(pickup.getTime()) || isNaN(returnD.getTime())) {
        return { valid: false, message: "Invalid date format" };
    }

    // Check if pickup date is in the past
    if (pickup < today) {
        return { valid: false, message: "Pickup date cannot be in the past" };
    }

    // Check if return date is before or same as pickup date
    if (returnD <= pickup) {
        return { valid: false, message: "Return date must be after pickup date" };
    }

    return { valid: true };
}


// API to check car availability for given date and location
export const checkCarAvailability = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        console.log("Checking availability:", { location, pickupDate, returnDate });

        // ✅ FIXED: Validate dates
        const validation = validateDates(pickupDate, returnDate);
        if (!validation.valid) {
            return res.json({ 
                success: false, 
                message: validation.message 
            });
        }

        // Fetch cars based on location
        const cars = await Car.find({ location, isAvailable: true });

        console.log(`Found ${cars.length} cars in ${location}`);

        // Check availability for each car
        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
            return { ...car._doc, isAvailable };
        });

        const allCars = await Promise.all(availableCarsPromises);
        
        const availableCars = allCars.filter(car => car.isAvailable === true);

        console.log(`${availableCars.length} cars available for the dates`);

        res.json({ success: true, availableCars });

    } catch (error) {
        console.error("Check availability error:", error);
        res.json({ success: false, message: "Server Error" });
    }
}

// API to create a booking
export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate } = req.body;

        // ✅ FIXED: Validate dates before processing
        const validation = validateDates(pickupDate, returnDate);
        if (!validation.valid) {
            return res.json({ 
                success: false, 
                message: validation.message 
            });
        }

        // Check if car is available
        const isAvailable = await checkAvailability(car, pickupDate, returnDate);

        

        if (!isAvailable) {
            return res.json({ 
                success: false, 
                message: "Car is not available for the selected dates" 
            });
        }

        const carData = await Car.findById(car);

        if (!carData) {
            return res.json({ success: false, message: "Car not found" });
        }

         if (carData.owner.toString() === _id.toString()) {
            return res.json({
                success: false,
                message: "Owner cannot book their own car"
            });
        }
          

        // Calculate total amount
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        
        // ✅ FIXED: Double check that noOfDays is positive
        if (noOfDays <= 0) {
            return res.json({ 
                success: false, 
                message: "Invalid booking duration" 
            });
        }

        const price = noOfDays * carData.pricePerDay;

        await Booking.create({
            car,
            owner: carData.owner,
            user: _id,
            pickupDate,
            returnDate,
            price
        });

        res.json({ success: true, message: "Booking created successfully" });

    } catch (error) {
        console.error("Create booking error:", error);
        res.json({ success: false, message: "Server Error" });
    }
}

// API to list user bookings
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id })
            .populate("car")
            .populate("owner")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });

    } catch (error) {
        console.error("Get user bookings error:", error);
        res.json({ success: false, message: "Server Error" });
    }
}

// Get owner bookings
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.json({ success: false, message: "Access denied" });
        }

        const bookings = await Booking.find({ owner: req.user._id })
            .populate("car user")
            .select("-user.password")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });

    } catch (error) {
        console.error("Get owner bookings error:", error);
        res.json({ success: false, message: "Server Error" });
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingid, status } = req.body;

        const booking = await Booking.findById(bookingid);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Access denied" });
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Booking status updated successfully" });

    } catch (error) {
        console.error("Change booking status error:", error);
        res.json({ success: false, message: "Server Error" });
    }
}
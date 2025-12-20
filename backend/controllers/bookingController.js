// check car availability
import Booking from "../models/Booking.js";

const checkAvailability = async(car,pickupDate,returnDate) => {
   const bookings = await Booking.find({
    car ,
    pickupDate: { $lt: returnDate },
    returnDate: { $gt: pickupDate }
   });

    return bookings.length === 0;

}


// api to check car availability for given date and location

export const checkCarAvailability = async(req,res) => {
    try {
        const {location,pickupDate,returnDate} = req.body;
        // fetch cars based on location
        const cars = await Car.find({ location ,isAvailable:true});

        // check availability for each car
        const availablecarsPromises = cars.map(async(car) => {
              const isAvailable =   await checkAvailability(car._id,pickupDate,returnDate) 
              return {...car._doc,isAvailable : isAvailable};
            }
        );

        const availablecars = await Promise.all(availablecarsPromises);
         availablecars = availablecars.filter(car => car.isAvailable === true);

        res.status(200).json({ success: true, availablecars });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
        
    }
}

// api to book a car

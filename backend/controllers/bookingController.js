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

// api to create a booking

export const createBooking = async(req,res) => {
   try {
    const {_id} = req.user;
    const {car ,pickupDate,returnDate} = req.body;
    const isAvailable = await checkAvailability(car,pickupDate,returnDate);

    if(!isAvailable){
        return res.status(400).json({ success : false,message: "Car is not available for the selected dates" });
    }
    const carData = await Car.findById(car);
    // calculate total amount
    const picked =  new Date(pickupDate);
     const  returned = new Date(returnDate);

     const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)) + 1;
     const price = noOfDays * carData.pricePerDay;

     await Booking.create({
        car , owner :  carData.owner, user : _id , pickupDate, returnDate, price  })

        res.status(200).json({ success : true,message: "Booking created successfully" });

    
   } catch (error) {
    console.log(error);
    res.status(500).json({  success : false,message: "Server Error" });
    
   }

}

// api to list user bookings

export const getUserBookings = async(req,res) => {
  
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user : _id}).populate("car").populate("owner").sort({ createdAt : -1});
        res.status(200).json({ success : true,bookings });
        
    } catch (error) {
        console.log(error);
    res.status(500).json({  success : false,message: "Server Error" });
    }

}

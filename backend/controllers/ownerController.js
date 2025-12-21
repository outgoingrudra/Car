import User from "../models/user.js"
import fs from 'fs';
import imagekit from "../configs/imagekit.js"
import Car from "../models/Car.js"
import Booking from "../models/Booking.js";
export const changeRoleToOwner = async (req, res) => {
    try {
        const {_id } = req.user;
        await User.findByIdAndUpdate(_id, {role: 'owner'});
        res.json({success:true , message: 'Role updated to owner successfully'});
    } catch (error) {
        res.json({success:false, message: 'Error updating role'});
    }
}

// Add to list a car

export const addCar = async (req, res) => {
    try {

        const {_id } = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;
        // upload image to image kit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file : fileBuffer, 
            fileName : imageFile.originalname,
            folder: "/cars"
        })
        var optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {
                    width : "1280",  
                },
                {quality  : "auto"}
                ,{format  : "webp"}
            ]
        });
        const image = optimizedImageUrl;
        await Car.create({
            ...car,
            image,
            owner: _id
        })
        res.json({success:true , message: 'Car added successfully'
        })
        


        
    } catch (error) {
         console.log(error);
         res.json({success:false, message: 'Error updating role'});
    }

}

export const getOwnerCars = async (req, res) => {
    try {
        const {_id } = req.user;
        const cars = await Car.find({owner: _id});
        res.json({success:true , cars})
    } catch (error) {
        res.json({success:false, message: 'Error fetching cars'});
    }
}

// api to toggle car availability

export const toggleCarAvailability = async (req, res) => {
    try {
        const {carId} = req.params;
        const car = await Car.findById(carId);
        const {_id} = req.user;

        // if car belongs to the owner
        if(car.owner.toString() !== _id.toString()){
            return res.json({success:false , message: 'You are not authorized to update this car'});
        }
        car.isAvailable = !car.isAvailable;
        await car.save();
        res.json({success:true , message: 'Car availability updated successfully'})
    } catch (error) {
        res.json({success:false, message: 'Error updating car availability'});
    }   
}

// api to delete a car

export const deleteCar = async (req, res) => {
    try {
        const {carId} = req.params;
        const car = await Car.findById(carId);
        const {_id} = req.user;
        // if car belongs to the owner
        if(car.owner.toString() !== _id.toString()){
            return res.json({success:false , message: 'You are not authorized to delete this car'});
        }
        car.owner = null ,
        car.isAvailable = false;
        await Car.findByIdAndDelete(carId);
        res.json({success:true , message: 'Car deleted successfully'})
    } catch (error) {
        res.json({success:false, message: 'Error deleting car'});
    }
}


//get dashboard data 
export  const getDashboardData = async (req, res) => {
    try {
        const {_id ,role} = req.user;
        if(role !== 'owner'){
            return res.json({success:false , message: 'You are not authorized to access this data'});
        }
        const cars = await Car.find({owner: _id});
        const bookings = await Booking.find({owner: _id}).populate("car").sort({ createdAt : -1});

        const pendingBookings = await Booking.find({owner: _id, status: 'pending'});
        const completedBookings = await Booking.find({owner: _id, status: 'confirmed'});
        // calculate monthly revenue
        const monthlyRevenue = bookings.slice().filter(booking => {booking.status === 'confirmed'}).reduce((acc, booking) => { acc+booking.price ,0})


        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }
        res.json({success:true , dashboardData})

        
    } catch (error) {
        console.log(error);
        res.json({success:false, message: 'Error fetching dashboard data'});

        
    }
}
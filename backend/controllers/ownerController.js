import User from "../models/user.js"
import fs from 'fs';
import imagekit from "../configs/imagekit.js"
import Car from "../models/Car.js"
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

        // if car belongs to the owner
        if(car.owner.toString() !== carId.toString()){
            return res.json({success:false , message: 'You are not authorized to update this car'});
        }
        car.isAvailable = !car.isAvailable;
        await car.save();
        res.json({success:true , message: 'Car availability updated successfully'})
    } catch (error) {
        res.json({success:false, message: 'Error updating car availability'});
    }   
}


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
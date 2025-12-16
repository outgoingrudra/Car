import User from "../models/user.js"
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
        
        
    } catch (error) {
         console.log(error);
         res.json({success:false, message: 'Error updating role'});
    }
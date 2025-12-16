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
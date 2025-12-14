
import { JsonWebTokenError } from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// generate token function

const generateToken = (id) => {
    const payload =  id 
    return jwt.sign(payload, process.env.JWT_SECRET);
}

export const  registerUser = async (req, res) => {
    try {
        const { name, email, password} = req.body;
        if(!name || !email || !password || password.length < 8){
            return  res.json({success : false , message: "Fill all fields" });
        }   

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user._id.toString());
     
        res.status(201).json({
            success: true,
           token}); 





    }   catch (error) {
        console.log(error.message);
        res.status(500).send({ success:false,  message: error.message });

    }
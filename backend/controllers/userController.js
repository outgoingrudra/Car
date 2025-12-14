
import { JsonWebTokenError } from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

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
     
        res.status(201).json({ success: true, message: "User registered successfully" });





    }   catch (error) {
        res.status(500).send({ message: error.message });
    }
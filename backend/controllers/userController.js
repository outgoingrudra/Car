import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js"

// generate token function

const generateToken = (id) => {
  const payload = id;
  return jwt.sign(payload, process.env.JWT_SECRET);
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 5) {
      return res.json({ success: false, message: "Fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
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
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ success: false, message: error.message });
  }
};


// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all fields" });
    }       
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .json({ success: false, message: "User does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .json({ success: false, message: "Invalid credentials" });
    }   
    const token = generateToken(user._id.toString());
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ success: false, message: error.message });
  } 
};

// get user details using token

export const getUserData = async (req, res) => {
  try {
    const {user} = req;
    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.send({ success: false, message: error.message });
  }
};

// get all car
export const getCars = async(req,res)=>{
  
  try {
    const cars = await Car.find({isAvailable:true})
    res.status(200).json({success:true , cars}) // Add status 200
  } catch (error) {
    console.log(error.message)
    res.status(500).json({success:false , message:error.message}) // Add status 500
  }
}

export const EmailSender = async(req,res)=>{
  try {
    console.log("func trigger");
    
    console.log(req.body)
     res.json({success:true , message:"Working it -----"})
  } catch (error) {
    console.log(error);
    
       res.json({success:false , message:"Not Working it -----"})
  }
}
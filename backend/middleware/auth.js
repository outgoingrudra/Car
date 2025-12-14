
import jwt from "jsonwebtoken";
import User from "../models/user";
const protect = async(req, res, next) => {
  const token = req.headers.authorization;
    if (!token) {
        return res.json({ success: false, message: "No token, authorization denied" });
    }

    try {
        const userid = jwt.decode(token, process.env.JWT_SECRET);
        if(!userid) {
            return  res.json({ success: false, message: "Token is not valid" });
        }
        req.user =  await User.findById(userid).select("-password");
        next();
    } catch (error) {
        return res.json({ success: false, message: "Token is not valid" });
    }   
};
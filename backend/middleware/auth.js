
import jwt from "jsonwebtoken";
import User from "../models/user.js";
export const protect = async(req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
        return res.json({ success: false, message: "No token, authorization denied" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const userid = typeof payload === "string" ? payload : payload.sub;
        if(!userid) {
            return  res.json({ success: false, message: "Token is not valid" });
        }
        req.user = await User.findById(userid).select("-password");
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User no longer exists" });
        }
        const version = typeof payload === "string" ? 0 : payload.version;
        if (version !== (req.user.tokenVersion || 0)) {
            return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
        }
        if (req.user.isEmailVerified === false) {
            return res.status(403).json({ success: false, message: "Verify your email first" });
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: "Token is not valid" });
    }   
};


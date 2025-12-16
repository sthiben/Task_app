import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/user.model.js";

dotenv.config();

// Middleware to verify the token
export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        //See data token encrypted
        //console.log(verified);
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

// Middleware to verify if user is admin
export const verifyAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        if (user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admin only." });
        }
        
        next();
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
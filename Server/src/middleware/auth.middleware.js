import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//Middleware? - A function that runs before the actual route handler
//Protect Route - A middleware to protect routes that require authentication
export const protectRoute = async (req, res, next) => {
    
    try {
        // Get token from cookies or headers
        const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

        if (!token) { 
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token"
            });
        }   

        // Find user by ID and exclude sensitive fields
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found"
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.log(`Error in Protect Route ${error}`);
        res.status(500).json({
            success: false,
            message: "Server Error: " + error.message
        })
    }
}
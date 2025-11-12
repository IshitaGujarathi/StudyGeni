import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Middleware to check if user is authenticated
export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized - No token provided"
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(decoded.userID).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user; // Attach user to the request object
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Middleware to check if user is a Teacher
export const isTeacher = (req, res, next) => {
    if (req.user?.role !== 'teacher') {
        return res.status(403).json({
            message: "Access denied. Teacher role required."
        });
    }
    next();
};

// Middleware to check if user is a Student (optional, if needed)
export const isStudent = (req, res, next) => {
    if (req.user?.role !== 'student') {
        return res.status(403).json({
            message: "Access denied. Student role required."
        });
    }
    next();
};
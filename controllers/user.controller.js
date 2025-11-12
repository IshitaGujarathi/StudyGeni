import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const generateToken = (userID, role) => {
    return jwt.sign({ userID, role }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // Using 'name'
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required!" });
        }
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Role validation
        let userRole = 'student'; // Default role
        if (role && ['student', 'teacher'].includes(role)) {
            userRole = role;
        }

        const newUser = await User.create({
            name, email, password, role: userRole
        });

        const token = generateToken(newUser._id, newUser.role);

        res.status(201).json({
            success: true,
            message: "User created",
            token,
            user: {
                id: newUser._id,
                name: newUser.name, // Using 'name'
                email: newUser.email,
                role: newUser.role,
            }
        });

    } catch (error) {
        console.log('Error in signup controller: ', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name, // Using 'name'
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// New controller to get current user info
export const getMe = async (req, res) => {
    try {
        // req.user is attached by the protectRoute middleware
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error("GetMe Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
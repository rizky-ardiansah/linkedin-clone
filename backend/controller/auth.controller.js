import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';

export const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create(
            {
                name,
                email,
                password: hashedPassword,
                username,
            });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        res.cookie("jwt-linkedin", token, {
            httpOnly: true, // mencegah serangan xss
            maxAge: 3 * 24 * 60 * 60 * 1000, //3 hari
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production", // Prevents man in the middle attack
        });

        res.status(201).json({ message: "User created successfully" });

        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

        try {
            await sendWelcomeEmail(user.email, user.name, profileUrl);
        } catch (emailError) {
            console.error("Error sending email: ", emailError);
        }
    } catch (error) {
        console.log("Signup error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        // cek apakah user ada
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // cek apakah password benar
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // buat token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        res.cookie("jwt-linkedin", token, {
            httpOnly: true, // mencegah serangan xss
            maxAge: 3 * 24 * 60 * 60 * 1000, //3 hari
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production", // Prevents man in the middle attack
        });

        res.json({ message: "Logged in successfully" });
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const logout = async (req, res) => {
    res.clearCookie("jwt-linkedin");
    res.json({ message: "User logged out" });
}

export const getCurrentUser = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error("Get current user error: ", error);
        res.status(500).json({ message: "Server error" });
    }
}
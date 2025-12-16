import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import * as authService from "../services/auth.service.js";

/* =========================
   Signup Controller
========================= */
export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, adharNumber, password, email, address, age, phone } = req.body;

    // Basic validation
    if (!name || !adharNumber || !password || !email || !address || age === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if Aadhaar already exists
    const existingUser = await User.findOne({ adharNumber });
    if (existingUser) {
      return res.status(400).json({
        message: "Aadhaar number already exists, please use a different one",
      });
    }

    // Create user
    const newUser = await authService.createUser({
      name,
      email,
      password,
      adharNumber,
      address,
      age,
      phone,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Set secure cookie
    res.cookie("jwt", token, {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Remove sensitive data
    const { password: _, ...userData } = newUser._doc;
    console.log("User is created " + userData.name);
    
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Error in signup controller", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

/* =========================
   Login Controller
========================= */
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { adharNumber, password } = req.body;

    if (!adharNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ adharNumber });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Aadhaar number or password",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid Aadhaar number or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const { password: _, ...userData } = user._doc;

    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   Logout Controller
========================= */
export const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

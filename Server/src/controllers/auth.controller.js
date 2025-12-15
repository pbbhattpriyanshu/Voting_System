import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import * as authService from "../services/auth.service.js";

//Signup controller
export const signup = async (req, res) => {
  // Validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, adharNumber, password, email, address, age, phone } =
      req.body;
    console.log(password);

    // Manual validations (basic business logic)
    if (!name || !adharNumber || !password || !email || !address || !age) {
      return res.status(400).json({ message: "all fields are required" });
    }

    if (password.length <= 8) {
      return res
        .status(400)
        .json({ message: "Password must at least 8 characters long" });
    }

    //Check user already exist?
    const existingUser = await User.findOne({ adharNumber: adharNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "Adhar number is already exist, please use different one",
        });
    }

    console.log(name, adharNumber, password);

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

    // Generate JWT Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Set cookie for secure storage
    res.cookie("jwt", token, {
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Remove sensitive fields
    const { password: _, ...userData } = newUser._doc;

    console.log("User is created successfully", token);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userData,
    });
  } catch (error) {
    console.error(`Error in signup controller ${error}`);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error, please try again later.",
    });
  }
};

//Login controller
export const login = async (req, res) => {
  //Validtion
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { adharNumber, password } = req.body;

    const user = await User.findOne({ adharNumber });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid adhar number or password" });
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //Set cookie in response
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // Cannot be accessed via JavaScript (secure)
      sameSite: "strict", // Prevents CSRF
      secure: process.env.NODE_ENV === "production", // Use HTTPS only in production
    });

    // Remove sensitive info (like password) before sending response
    const { password: _, ...userData } = user._doc;
    console.log("User login Sucessfully");

    //Send user data in response
    res.status(201).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.log("Error in login Controller", error);
    res.status(500).json({ message: error.message });
  }
};

//Logout controller
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  console.log("User Logout Sucessfully");
  res.status(201).json({ message: "Logout Successful" });
};

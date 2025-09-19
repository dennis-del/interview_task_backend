// src/controllers/authController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/connection";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

// Check if database is connected
if (!AppDataSource.isInitialized) {
  console.log("Database not initialized. Trying to connect...");
  AppDataSource.initialize()
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
    });
}

const userRepo = AppDataSource.getRepository(User);

export const signup = async (req: Request, res: Response) => {
  try {
    console.log("Signup function called");
    const { name, email, password, role } = req.body;

    console.log('Request body:', req.body);

    if (!AppDataSource.isInitialized) {
      console.log("Database not connected");
      return res.status(500).json({ message: "Database connection error" });
    }

    // Check if user already exists
    console.log("Checking for existing user with email:", email);
    const existing = await userRepo.findOne({ where: { email } });
    console.log("Existing user result:", existing);

    if (existing) {
      console.log("User already exists");
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    console.log("Creating new user");
    const newUser = userRepo.create({
      name,
      email,
      password, // plain text (consider hashing for real apps)
      role: role || "Participant",
    });

    await userRepo.save(newUser);
    console.log("New user saved:", newUser);

    // Return only the user, no JWT
    return res.status(201).json({
      message: "User created successfully",
      user: { id: newUser.id, name, email, role: newUser.role },
    });
  } catch (err) {
    console.error("Error in signup:", err);
    return res.status(500).json({ message: "Error in signup", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).json({ message: "Error in login", error: err });
  }
};

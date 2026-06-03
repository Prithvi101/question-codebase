import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUserByEmail, findUserById } from "../utils/db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // INTENTIONAL ISSUE: Comparing raw password with raw password instead of hash.
    // Also, using synchronous bcrypt compare instead of async or correct comparison logic.
    // If the candidate doesn't fix this, correct passwords won't work!
    const isPasswordValid = password === user.passwordHash; // Bug here

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // INTENTIONAL ISSUE: Missing role in the JWT payload
    const token = jwt.sign(
      { userId: user.id }, // Missing role here
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      refreshToken
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const user = findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // INTENTIONAL ISSUE: Leaking the passwordHash
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  // INTENTIONAL ISSUE: Empty controller for refresh token
  // The candidate must implement this fully.
  return res.status(501).json({ message: "Not implemented" });
};

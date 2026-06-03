import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Extend Express Request object to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  // INTENTIONAL ISSUE: No try/catch around jwt.verify.
  // Expired tokens will throw an error and crash the request with a 500 status.
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  
  next();
};

// TODO: Implement requireRole middleware
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Implement role based access control here
    next();
  };
};

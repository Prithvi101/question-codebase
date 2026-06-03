import { Router, Request, Response } from "express";
import { login, getProfile, refresh } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/refresh", refresh);

// Protected routes
router.get("/profile", requireAuth, getProfile);

// INTENTIONAL ISSUE: Admin endpoint lacks requireRole("ADMIN") middleware
router.get("/admin/dashboard", requireAuth, (req: Request, res: Response) => {
  res.json({ message: "Welcome to the admin dashboard. Only admins should see this!" });
});

export default router;

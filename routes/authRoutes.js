import express from "express";
import { getMe, loginUser, registerUser } from "../controller/AuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ /me route - protected
router.get("/me", protect, getMe);

export default router;

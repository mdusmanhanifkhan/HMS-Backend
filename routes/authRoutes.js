import express from "express";
import { createUser, deleteUser, getAllUsers, getMe, getSingleUser, loginUser, updateUser, updateUserRole } from "../controller/AuthController.js";
import { protect } from "../middleware/authMiddleware.js";
import { superAdminOnly } from "../middleware/superAdminMiddleware.js";

const router = express.Router();

router.post("/register" ,createUser);
router.post("/login", loginUser);

// ✅ /me route - protected
router.get("/me", protect, getMe);

router.get('/users' ,protect , superAdminOnly, getAllUsers)
router.get('/user/:id' ,protect , superAdminOnly, getSingleUser)
router.get('/user/:id' ,protect , superAdminOnly, updateUser)
router.get('/user/:id' ,protect , superAdminOnly, updateUserRole)
router.get('/user/:id' , protect , superAdminOnly,deleteUser)

export default router;

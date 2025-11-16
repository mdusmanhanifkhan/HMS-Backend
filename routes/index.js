import { Router } from "express"

// ✅ Import routes
import departmentRoutes from "./departmentRoutes.js"
import procedureRoutes from "./procedureRoutes.js"
import doctorRoutes from "./doctorRoutes.js"
import patientRoutes from "./patientRoutes.js"
import welfareRoutes from "./welfareRoutes.js"
import feeRoutes from "./feeRoutes.js"
import authRoutes from "./authRoutes.js"
import roleRoutes from "./roleRoutes.js"


// ✅ Import middleware
import { protect } from "../middleware/authMiddleware.js"

const router = Router()

// -----------------------------
// 🔐 Public Routes
// -----------------------------
router.use("/api", authRoutes)
router.use("/api", roleRoutes)


// -----------------------------
// 🏥 Protected Routes (require login)
// -----------------------------
router.use("/api", protect, departmentRoutes)
router.use("/api", protect, procedureRoutes)
router.use("/api", protect, doctorRoutes)
router.use("/api", protect, patientRoutes)
router.use("/api", protect, welfareRoutes)
router.use("/api", protect, feeRoutes)

// Example future:
// router.use("/api/medical-records", protect, medicalRecordRoutes)

export default router

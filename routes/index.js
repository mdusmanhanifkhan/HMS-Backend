import { Router } from "express";
import departmentRoutes from "./departmentRoutes.js"
const router = Router()

router.use("/api" ,departmentRoutes)

export default router
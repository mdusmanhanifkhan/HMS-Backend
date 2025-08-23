import { Router } from "express";
import departmentRoutes from "./departmentRoutes.js"
import procedureRoutes from "./procedureRoutes.js"
const router = Router()

router.use("/api" ,departmentRoutes)
router.use("/api" ,procedureRoutes)

export default router
import { Router } from "express";
import departmentRoutes from "./departmentRoutes.js"
import procedureRoutes from "./procedureRoutes.js"
import doctorRoutes from "./doctorRoutes.js"
const router = Router()

router.use("/api" ,departmentRoutes)
router.use("/api" ,procedureRoutes)
router.use("/api" ,doctorRoutes)

export default router
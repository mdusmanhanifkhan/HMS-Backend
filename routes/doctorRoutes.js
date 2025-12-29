import {Router} from "express";
import { createDoctor, deleteDoctor, getDoctorById, getDoctors, updateDoctor } from "../controller/DoctorController.js";

const router = Router()

router.post("/doctor", createDoctor)
router.get("/doctors", getDoctors)
router.get("/doctor/:id", getDoctorById)
router.put("/doctor/:id", updateDoctor)
router.delete("/doctor/:id", deleteDoctor)

export default router
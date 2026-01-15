import {Router} from "express";
import { createDoctor, getDoctors , getDoctorById , updateDoctor , deleteDoctor, getAllDoctors } from "../controller/DoctorController.js";

const router = Router()

router.post("/doctor", createDoctor)
router.get("/doctors", getDoctors)
router.get("/all-doctors", getAllDoctors)
router.get("/doctor/:id", getDoctorById)
router.put("/doctor/:id", updateDoctor)
router.delete("/doctor/:id", deleteDoctor)

export default router

import {Router} from "express";
<<<<<<< HEAD
import { createDoctor, deleteDoctor, getDoctorById, getDoctors, updateDoctor } from "../controller/DoctorController.js";
=======
import { createDoctor, getDoctors , getDoctorById , updateDoctor , deleteDoctor } from "../controller/DoctorController.js";
>>>>>>> 8daaba6 (make some changes)

const router = Router()

router.post("/doctor", createDoctor)
router.get("/doctors", getDoctors)
router.get("/doctor/:id", getDoctorById)
router.put("/doctor/:id", updateDoctor)
router.delete("/doctor/:id", deleteDoctor)

export default router

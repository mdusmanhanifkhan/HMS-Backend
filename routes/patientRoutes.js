import {Router} from "express";
import { createPatient, getPatientById, getPatients , updatePatient ,searchPatients ,deletePatient} from "../controller/PatientController.js";

const router = Router()

router.post("/patient", createPatient)
router.get("/patient/search", searchPatients);
router.get("/patients", getPatients)
router.get("/patient/:id", getPatientById)
router.put("/patient/:id", updatePatient)
router.delete("/patient/:id", deletePatient)

export default router
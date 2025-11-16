import {Router} from "express";
import { createPatient, getPatientById, getPatients , updatePatient ,searchPatientByPatientId} from "../controller/PatientController.js";

const router = Router()

router.post("/patient", createPatient)
router.get("/patient/search", searchPatientByPatientId);
router.get("/patients", getPatients)
router.get("/patient/:id", getPatientById)
router.put("/patient/:id", updatePatient)

export default router
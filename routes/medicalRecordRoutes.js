import express from "express";
import {
  createMedicalRecord,
  createMedicalRecordPatients,
  exportMedicalRecordsExcel,
  getMedicalRecords,
  getMedicalRecordsByPatient,
} from "../controller/MedicalRecordController.js";

const router = express.Router();

router.post("/medical-records", createMedicalRecord);
router.post("/medical-records-patients", createMedicalRecordPatients);
router.get("/medical-records/:patientId", getMedicalRecordsByPatient);
router.get("/medical-records", getMedicalRecords);
router.get("/medical-records/export/excel", exportMedicalRecordsExcel);

export default router;

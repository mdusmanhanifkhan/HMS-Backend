import express from 'express'
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordsByPatient,
} from '../controller/MedicalRecordController.js'

const router = express.Router()

router.post('/medical-records', createMedicalRecord)
router.get('/medical-records/:patientId', getMedicalRecordsByPatient)
router.get('/medical-records', getMedicalRecords)

export default router

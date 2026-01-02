import express from 'express'
import {
    createMedicalHistory,
  getMedicalHistoryByPatient,
} from '../controller/MedicalRecordController.js'

const router = express.Router()

router.post('/medical-records', createMedicalHistory)
router.get('/medical-records/:patientId', getMedicalHistoryByPatient)

export default router

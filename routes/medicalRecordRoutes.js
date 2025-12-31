import express from 'express'
import {
  createMedicalRecord,
  getMedicalRecordsByPatient,
} from '../controller/MedicalRecordController.js'

const router = express.Router()

router.post('/medical-records', createMedicalRecord)
router.get('/:patientId', getMedicalRecordsByPatient)

export default router

import { Router } from "express";
import { createLabFee, getLabFeeById, getLabFees, updateLabFee } from "../controller/LabFeeController.js";

const router = Router()

router.post('/lab-fees' , createLabFee)
router.get('/all-lab-fees' , getLabFees)
router.put('/doctor-lab/:id' , updateLabFee)
// router.delete('/doctor-lab/:id' , deleteDoctorFee)
router.get('/doctor-lab/:id', getLabFeeById)

export default router
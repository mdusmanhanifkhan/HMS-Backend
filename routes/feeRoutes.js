import { Router } from "express";
import { createDoctorFee , deleteDoctorFee, getDoctorFees, updateDoctorFee} from "../controller/FeeController.js";

const router = Router()

router.post('/doctor-fees' , createDoctorFee)
router.get('/all-doctor-fees' , getDoctorFees)
router.put('/doctor-fees/:id' , updateDoctorFee)
router.delete('/doctor-fees/:id' , deleteDoctorFee)

export default router
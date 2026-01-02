import { Router } from "express";
import { createDoctorFee , getDoctorFees , deleteDoctorFee, updateDoctorFee , getSingleDoctorFee} from "../controller/FeeController.js";

const router = Router()

router.post('/doctor-fees' , createDoctorFee)
router.get('/all-doctor-fees' , getDoctorFees)
router.put('/doctor-fees/:id' , updateDoctorFee)
router.delete('/doctor-fees/:id' , deleteDoctorFee)
router.get('/doctor-fees/:id', getSingleDoctorFee)

export default router

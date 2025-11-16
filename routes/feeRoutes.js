import { Router } from "express";
import { createDoctorFee , getDoctorFees} from "../controller/FeeController.js";

const router = Router()

router.post('/doctor-fees' , createDoctorFee)
router.get('/all-doctor-fees' , getDoctorFees)

export default router
import { Router } from "express";
<<<<<<< HEAD
import { createDoctorFee , deleteDoctorFee, getDoctorFees, updateDoctorFee} from "../controller/FeeController.js";
=======
import { createDoctorFee , getDoctorFees , deleteDoctorFee, updateDoctorFee , getSingleDoctorFee} from "../controller/FeeController.js";
>>>>>>> 8daaba6 (make some changes)

const router = Router()

router.post('/doctor-fees' , createDoctorFee)
router.get('/all-doctor-fees' , getDoctorFees)
router.put('/doctor-fees/:id' , updateDoctorFee)
router.delete('/doctor-fees/:id' , deleteDoctorFee)
<<<<<<< HEAD
=======
router.get('/doctor-fees/:id', getSingleDoctorFee)
>>>>>>> 8daaba6 (make some changes)

export default router

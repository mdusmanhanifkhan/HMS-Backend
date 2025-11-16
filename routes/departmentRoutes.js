import { Router } from "express";
import { createDepartment, deleteDepartment, getDepartments, getSingleDepartment, updateDepartment ,getDepartmentDoctorProcedureTree} from "../controller/DepartmentController.js";

const router = Router()

router.post('/department' , createDepartment)
router.get('/department' , getDepartments)
router.delete('/department/:id' , deleteDepartment)
router.put('/department/:id' , updateDepartment)
router.get('/department/:id' , getSingleDepartment)
router.get('/department/:id' , getSingleDepartment)
router.get("/department-doctor-procedure-tree", getDepartmentDoctorProcedureTree)

export default router;
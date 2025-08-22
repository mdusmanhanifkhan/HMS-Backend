import { Router } from "express";
import { createDepartment, deleteDepartment, getDepartment, updateDepartment } from "../controller/DepartmentController.js";

const router = Router()

router.post('/department' , createDepartment)
router.get('/department' , getDepartment)
router.delete('/department/:id' , deleteDepartment)
router.put('/department/:id' , updateDepartment)


export default router;
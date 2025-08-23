import { Router } from "express";
import { createDepartment, deleteDepartment, getDepartment, getSingleDepartment, updateDepartment } from "../controller/DepartmentController.js";

const router = Router()

router.post('/department' , createDepartment)
router.get('/department' , getDepartment)
router.delete('/department/:id' , deleteDepartment)
router.put('/department/:id' , updateDepartment)
router.get('/department/:id' , getSingleDepartment)


export default router;
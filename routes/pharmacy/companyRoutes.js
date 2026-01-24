import { Router } from "express";
import { createCompany } from "../../controller/pharmacy/CompanyController.js";

const router = Router()

router.post('/company' , createCompany)

export default router

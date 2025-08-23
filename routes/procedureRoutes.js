import { Router } from "express";
import { createProcedure, deleteProcedure, getProcedureById, getProcedures, updateProcedure } from "../controller/ProcedureController.js";

const router = Router()

router.post("/procedures", createProcedure)
router.get("/procedures", getProcedures)
router.get("/procedures/:id", getProcedureById)
router.put("/procedures/:id", updateProcedure
)
router.delete("/procedures/:id", deleteProcedure)

export default router
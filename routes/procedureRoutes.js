import { Router } from "express";
import { createProcedure, deleteProcedure, getProcedureById, getProcedures, updateProcedure , searchProcedures, getActiveProcedures } from "../controller/ProcedureController.js";

const router = Router()

router.post("/procedures", createProcedure)
router.get("/procedures", getProcedures)
router.get("/active-procedures", getActiveProcedures)
router.get("/procedures/search", searchProcedures)
router.get("/procedures/:id", getProcedureById)
router.put("/procedures/:id", updateProcedure
)
router.delete("/procedures/:id", deleteProcedure)

export default router
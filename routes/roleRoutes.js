import express from "express"
import { createRole } from "../controller/roleController.js"

const router = express.Router()

// Only admin can create roles
router.post("/roles", createRole)

export default router

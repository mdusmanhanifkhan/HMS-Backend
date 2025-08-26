import prisma from "../DB/db.config.js";

// Constants
const PROCEDURE_NAME_MAX = 100;
const PROCEDURE_SHORTCODE_MAX = 10;
const PROCEDURE_DESCRIPTION_MAX = 500;

const ERROR_MESSAGES = {
  REQUIRED: "is required",
  MAX_LENGTH: "exceeds max length",
  INVALID_ID: "Invalid procedure ID",
  NOT_FOUND: "Procedure not found",
  DEPARTMENT_NOT_FOUND: "Department not found",
  INTERNAL: "Internal server error",
};

// Helper for sending structured error responses
const sendError = (res, status, general_error, errors = {}) => {
  return res.status(status).json({ status, general_error, errors });
};

// Validation helper
const validateProcedureInput = ({ name, shortCode, description }) => {
  const errors = {};
  const missingFields = [];

  if (!name || typeof name !== "string" || name.trim() === "") missingFields.push("name");
  else if (name.length > PROCEDURE_NAME_MAX) errors.name = `Name ${ERROR_MESSAGES.MAX_LENGTH} (${PROCEDURE_NAME_MAX})`;

  if (!shortCode || typeof shortCode !== "string" || shortCode.trim() === "") missingFields.push("shortCode");
  else if (shortCode.length > PROCEDURE_SHORTCODE_MAX) errors.shortCode = `Short Code ${ERROR_MESSAGES.MAX_LENGTH} (${PROCEDURE_SHORTCODE_MAX})`;

  if (description && description.length > PROCEDURE_DESCRIPTION_MAX) errors.description = `Description ${ERROR_MESSAGES.MAX_LENGTH} (${PROCEDURE_DESCRIPTION_MAX})`;

  return { errors, missingFields };
};

// Create Procedure
export const createProcedure = async (req, res) => {
  try {
    const { name, shortCode, description, departmentId, status } = req.body;

    const { errors, missingFields } = validateProcedureInput({ name, shortCode, description });

    if (!departmentId) missingFields.push("departmentId");

    if (missingFields.length > 0 || Object.keys(errors).length > 0) {
      const general_error = missingFields.length
        ? `Validation failed: ${missingFields.join(", ")} ${ERROR_MESSAGES.REQUIRED}`
        : "Validation failed";
      return sendError(res, 400, general_error, errors);
    }

    // Check if department exists
    const department = await prisma.department.findUnique({ where: { id: Number(departmentId) } });
    if (!department) return sendError(res, 404, ERROR_MESSAGES.DEPARTMENT_NOT_FOUND);

    const procedure = await prisma.procedure.create({
      data: { name, shortCode, description, departmentId: Number(departmentId), status: status ?? true },
    });

    return res.status(201).json({ status: 201, message: "Procedure created successfully", data: procedure });
  } catch (error) {
    console.error("Error creating procedure:", error);
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL);
  }
};

// Get All Procedures with optional search
export const getProcedures = async (req, res) => {
  try {
    const { search } = req.query;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { shortCode: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const procedures = await prisma.procedure.findMany({
      where,
      include: { department: true },
      orderBy: { createdAt: "desc" },
    });

    if (!procedures.length) return sendError(res, 404, search ? `No procedures match "${search}"` : "No procedures found");

    return res.status(200).json({ status: 200, message: "Procedures retrieved successfully", data: procedures });
  } catch (error) {
    console.error("Error fetching procedures:", error);
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL);
  }
};

// Get Single Procedure
export const getProcedureById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendError(res, 400, ERROR_MESSAGES.INVALID_ID);

    const procedure = await prisma.procedure.findUnique({
      where: { id },
      include: { department: true },
    });
    if (!procedure) return sendError(res, 404, ERROR_MESSAGES.NOT_FOUND);

    return res.status(200).json({ status: 200, message: "Procedure retrieved successfully", data: procedure });
  } catch (error) {
    console.error("Error fetching procedure:", error);
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL);
  }
};

// Update Procedure
export const updateProcedure = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendError(res, 400, ERROR_MESSAGES.INVALID_ID);

    const { name, shortCode, description, departmentId, status } = req.body;
    const { errors } = validateProcedureInput({ name, shortCode, description });
    if (Object.keys(errors).length > 0) return sendError(res, 400, "Validation failed", errors);

    const procedure = await prisma.procedure.findUnique({ where: { id } });
    if (!procedure) return sendError(res, 404, ERROR_MESSAGES.NOT_FOUND);

    if (departmentId) {
      const department = await prisma.department.findUnique({ where: { id: Number(departmentId) } });
      if (!department) return sendError(res, 404, ERROR_MESSAGES.DEPARTMENT_NOT_FOUND);
    }

    const updatedProcedure = await prisma.procedure.update({
      where: { id },
      data: {
        name: name ?? procedure.name,
        shortCode: shortCode ?? procedure.shortCode,
        description: description ?? procedure.description,
        departmentId: departmentId ? Number(departmentId) : procedure.departmentId,
        status: status ?? procedure.status,
      },
    });

    return res.status(200).json({ status: 200, message: "Procedure updated successfully", data: updatedProcedure });
  } catch (error) {
    console.error("Error updating procedure:", error);
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL);
  }
};

// Delete Procedure
export const deleteProcedure = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendError(res, 400, ERROR_MESSAGES.INVALID_ID);

    const procedure = await prisma.procedure.findUnique({ where: { id } });
    if (!procedure) return sendError(res, 404, ERROR_MESSAGES.NOT_FOUND);

    await prisma.procedure.delete({ where: { id } });

    return res.status(200).json({ status: 200, message: "Procedure deleted successfully" });
  } catch (error) {
    console.error("Error deleting procedure:", error);
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL);
  }
};

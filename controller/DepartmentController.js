import prisma from "../DB/db.config.js";

// Constants
const DEPARTMENT_NAME_MAX = 100;
const DEPARTMENT_SHORTCODE_MAX = 10;
const DEPARTMENT_LOCATION_MAX = 100;
const DEPARTMENT_DESCRIPTION_MAX = 500;
const DEPARTMENT_TIME_MAX = 10; // max string length for time, e.g., "09:00"

// Error messages
const ERROR_MESSAGES = {
  REQUIRED: "is required",
  MAX_LENGTH: "exceeds max length",
  INVALID_ID: "Invalid department ID",
  NOT_FOUND: "Department not found",
  DUPLICATE: "already exists",
  HAS_RELATIONS: "Cannot delete department with existing procedures",
  INTERNAL: "Internal server error",
};

// Helper to send structured errors
const sendError = (res, status, general_error, errors = {}) =>
  res.status(status).json({ status, general_error, errors });

// Helper for validation
const validateDepartmentInput = ({ name, shortCode, location, description, timeFrom, timeTo }) => {
  const errors = {};
  const missingFields = [];

  if (!name || typeof name !== "string" || name.trim() === "") missingFields.push("name");
  else if (name.length > DEPARTMENT_NAME_MAX) errors.name = `Name ${ERROR_MESSAGES.MAX_LENGTH} (${DEPARTMENT_NAME_MAX})`;

  if (!shortCode || typeof shortCode !== "string" || shortCode.trim() === "") missingFields.push("shortCode");
  else if (shortCode.length > DEPARTMENT_SHORTCODE_MAX) errors.shortCode = `Short Code ${ERROR_MESSAGES.MAX_LENGTH} (${DEPARTMENT_SHORTCODE_MAX})`;

  if (location && location.length > DEPARTMENT_LOCATION_MAX) errors.location = `Location ${ERROR_MESSAGES.MAX_LENGTH} (${DEPARTMENT_LOCATION_MAX})`;
  if (description && description.length > DEPARTMENT_DESCRIPTION_MAX) errors.description = `Description ${ERROR_MESSAGES.MAX_LENGTH} (${DEPARTMENT_DESCRIPTION_MAX})`;

  if (timeFrom && timeFrom.length > DEPARTMENT_TIME_MAX) errors.timeFrom = `Opening time ${ERROR_MESSAGES.MAX_LENGTH} (${DEPARTMENT_TIME_MAX})`;
  if (timeTo && timeTo.length > DEPARTMENT_TIME_MAX) errors.timeTo = `Closing time ${ERROR_MESSAGES.MAX_LENGTH} (${DEPARTMENT_TIME_MAX})`;

  return { errors, missingFields };
};

// Create Department
export const createDepartment = async (req, res) => {
  try {
    const { name, shortCode, location, description, timeFrom, timeTo, status } = req.body;

    const { errors, missingFields } = validateDepartmentInput({ name, shortCode, location, description, timeFrom, timeTo });

    if (missingFields.length > 0 || Object.keys(errors).length > 0) {
      const general_error = missingFields.length
        ? `Validation failed: ${missingFields.join(", ")} ${ERROR_MESSAGES.REQUIRED}`
        : "Validation failed";
      return sendError(res, 400, general_error, errors);
    }

    // Check duplicates
    const existing = await prisma.department.findFirst({
      where: { OR: [{ name }, { shortCode }] },
    });

    if (existing) {
      const dupErrors = {};
      if (existing.name === name) dupErrors.name = `Name ${ERROR_MESSAGES.DUPLICATE}`;
      if (existing.shortCode === shortCode) dupErrors.shortCode = `Short Code ${ERROR_MESSAGES.DUPLICATE}`;
      return sendError(res, 409, "Duplicate department", dupErrors);
    }

    const department = await prisma.department.create({
      data: { name, shortCode, location, description, timeFrom, timeTo, status: status ?? true },
    });

    return res.status(201).json({ status: 201, message: "Department created successfully", data: department });
  } catch (error) {
    console.error("Error creating department:", error);
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL);
  }
};

// Get all departments (with optional search)
export const getDepartments = async (req, res) => {
  try {
    const { search } = req.query;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { shortCode: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const departments = await prisma.department.findMany({
      where,
      orderBy: { name: "asc" },
    });

    if (!departments.length) return sendError(res, 404, search ? `No departments match "${search}"` : "No departments found");

    return res.status(200).json({ status: 200, message: "Departments retrieved successfully", data: departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL);
  }
};

// Get single department
export const getSingleDepartment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendError(res, 400, ERROR_MESSAGES.INVALID_ID);

    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) return sendError(res, 404, ERROR_MESSAGES.NOT_FOUND);

    return res.status(200).json({ status: 200, message: "Department retrieved successfully", data: department });
  } catch (error) {
    console.error("Error fetching department:", error);
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL);
  }
};

// Update department
export const updateDepartment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendError(res, 400, ERROR_MESSAGES.INVALID_ID);

    const { name, shortCode, location, description, timeFrom, timeTo, status } = req.body;

    const { errors } = validateDepartmentInput({ name, shortCode, location, description, timeFrom, timeTo });
    if (Object.keys(errors).length > 0) return sendError(res, 400, "Validation failed", errors);

    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) return sendError(res, 404, ERROR_MESSAGES.NOT_FOUND);

    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: { name, shortCode, location, description, timeFrom, timeTo, status },
    });

    return res.status(200).json({ status: 200, message: "Department updated successfully", data: updatedDepartment });
  } catch (error) {
    console.error("Error updating department:", error);
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL);
  }
};

// Delete department
export const deleteDepartment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendError(res, 400, ERROR_MESSAGES.INVALID_ID);

    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) return sendError(res, 404, ERROR_MESSAGES.NOT_FOUND);

    const relatedProcedures = await prisma.procedure.findMany({ where: { departmentId: id } });
    if (relatedProcedures.length > 0) return sendError(res, 400, ERROR_MESSAGES.HAS_RELATIONS);

    await prisma.department.delete({ where: { id } });

    return res.status(200).json({ status: 200, message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL);
  }
};

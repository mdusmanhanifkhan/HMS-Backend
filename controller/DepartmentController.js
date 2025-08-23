import prisma from "../DB/db.config.js";

/**
 * @desc    Create a new department
 * @route   POST /api/departments
 * @access  Private (Admin/SuperAdmin)
 */

export const createDepartment = async (req, res) => {
  try {
    const { name, shortCode, location, description, status } = req.body;

    // Collect validation errors
    const errors = {};

    if (!name) {
      errors.name = "Name is required";
    }

    if (!shortCode) {
      errors.shortCode = "Short Code is required";
    }

    // If validation fails
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation failed",
        errors,
      });
    }

    // Check for duplicates
    const existing = await prisma.department.findFirst({
      where: {
        OR: [{ name }, { shortCode }],
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: "Department with same name or short code already exists",
        errors: {
          ...(existing.name === name && { name: "Name already exists" }),
          ...(existing.shortCode === shortCode && {
            shortCode: "Short Code already exists",
          }),
        },
      });
    }

    // Create department
    const department = await prisma.department.create({
      data: {
        name,
        shortCode,
        location,
        description,
        status: status ?? true,
      },
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
      errors: {
        general: "Something went wrong. Please try again later.",
      },
    });
  }
};

export const getDepartment = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({});

    if (!departments || departments.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No departments found",
        data: [],
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Departments retrieved successfully",
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);

    return res.status(500).json({
      status: 500,
      message: "An unexpected error occurred while retrieving departments",
      error: error.message,
    });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!department) {
      return res.status(404).json({
        status: 404,
        message: "Department not found",
      });
    }

    // Delete department
    await prisma.department.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      status: 200,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting department:", error);

    return res.status(500).json({
      status: 500,
      message: "An unexpected error occurred while deleting department",
      error: error.message,
    });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params; // department ID from URL
    const { name, shortCode, location, description, timeFrom, timeTo, status } =
      req.body;

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!department) {
      return res.status(404).json({
        status: 404,
        message: "Department not found",
      });
    }

    // Update department
    const updatedDepartment = await prisma.department.update({
      where: { id: Number(id) },
      data: {
        name,
        shortCode,
        location,
        description,
        timeFrom,
        timeTo,
        status,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Department updated successfully",
      data: updatedDepartment,
    });
  } catch (error) {
    console.error("Error updating department:", error);

    return res.status(500).json({
      status: 500,
      message: "An unexpected error occurred while updating department",
      error: error.message,
    });
  }
};

export const getSingleDepartment = async (req, res) => {
  try {
    const { id } = req.params; 

    const department = await prisma.department.findUnique({ 
      where: { id: Number(id) },
    });

    if (!department) {
      return res.status(404).json({
        status: 404,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      status: 200,
      data: department,
      message: "Get department successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "An unexpected error occurred while fetching department",
      error: error.message,
    });
  }
};


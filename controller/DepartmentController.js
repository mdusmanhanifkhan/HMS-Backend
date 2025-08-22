import prisma from "../DB/db.config.js";

/**
 * @desc    Create a new department
 * @route   POST /api/departments
 * @access  Private (Admin/SuperAdmin)
 */

export const createDepartment = async (req, res) => {
  try {
    const { name, shortCode, location, description, status } = req.body;
   
    // Basic validation
    if (!name || !shortCode) {
      return res.status(400).json({
        success: false,
        message: "Name and Short Code are required",
      });
    }

    // Check if department already exists
    const existing = await prisma.department.findFirst({
      where: {
        OR: [{ name }, { shortCode }],
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Department with same name or short code already exists",
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
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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

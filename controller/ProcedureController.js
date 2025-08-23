import prisma from "../DB/db.config.js";

export const createProcedure = async (req, res) => {
  try {
    const { name, shortCode, description, departmentId, status } = req.body;
    console.log(req.body);
    // Basic validation
    if (!name || !shortCode || !departmentId) {
      return res.status(400).json({
        status: 400,
        message: "Name, shortCode, and departmentId are required.",
      });
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: Number(departmentId) },
    });
    if (!department) {
      return res.status(404).json({
        status: 404,
        message: "Department not found.",
      });
    }

    // Create procedure
    const procedure = await prisma.procedure.create({
      data: {
        name,
        shortCode,
        description,
        departmentId: Number(departmentId),
        status: status ?? true,
      },
    });

    return res.status(201).json({
      status: 201,
      message: "Procedure created successfully.",
      data: procedure,
    });
  } catch (error) {
    console.error("Error creating procedure:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ✅ Get All Procedures
export const getProcedures = async (req, res) => {
  try {
    const procedures = await prisma.procedure.findMany({
      include: { department: true }, // include department info
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      status: 200,
      message: "Procedures fetched successfully.",
      data: procedures,
    });
  } catch (error) {
    console.error("Error fetching procedures:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ✅ Get Single Procedure by ID
export const getProcedureById = async (req, res) => {
  try {
    const { id } = req.params;

    const procedure = await prisma.procedure.findUnique({
      where: { id: Number(id) },
      include: { department: true },
    });

    if (!procedure) {
      return res.status(404).json({
        status: 404,
        message: "Procedure not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Procedure fetched successfully.",
      data: procedure,
    });
  } catch (error) {
    console.error("Error fetching procedure:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ✅ Update Procedure
export const updateProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortCode, description, departmentId, status } = req.body;

    // Check if procedure exists
    const existingProcedure = await prisma.procedure.findUnique({
      where: { id: Number(id) },
    });
    if (!existingProcedure) {
      return res.status(404).json({
        status: 404,
        message: "Procedure not found.",
      });
    }

    // If departmentId is provided, check if department exists
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: Number(departmentId) },
      });
      if (!department) {
        return res.status(404).json({
          status: 404,
          message: "Department not found.",
        });
      }
    }

    const updatedProcedure = await prisma.procedure.update({
      where: { id: Number(id) },
      data: {
        name: name ?? existingProcedure.name,
        shortCode: shortCode ?? existingProcedure.shortCode,
        description: description ?? existingProcedure.description,
        departmentId: departmentId
          ? Number(departmentId)
          : existingProcedure.departmentId,
        status: status ?? existingProcedure.status,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Procedure updated successfully.",
      data: updatedProcedure,
    });
  } catch (error) {
    console.error("Error updating procedure:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ✅ Delete Procedure
export const deleteProcedure = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if procedure exists
    const procedure = await prisma.procedure.findUnique({
      where: { id: Number(id) },
    });
    if (!procedure) {
      return res.status(404).json({
        status: 404,
        message: "Procedure not found.",
      });
    }

    await prisma.procedure.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      status: 200,
      message: "Procedure deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting procedure:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

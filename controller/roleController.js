import prisma from "../DB/db.config.js";

// ✅ Create a new role (admin, user, etc.)
export const createRole = async (req, res) => {
  try {
    const {
      name,
      description,
      canManageDepartments = false,
      canManageDoctors = false,
      canManagePatients = false,
      canManageWelfare = false,
      canManageProcedures = false,
      canManageFees = false,
      canViewReports = false,
    } = req.body

    // Check if role exists
    const existingRole = await prisma.role.findUnique({ where: { name } })
    if (existingRole)
      return res.status(400).json({ message: "Role already exists" })

    const role = await prisma.role.create({
      data: {
        name,
        description,
        canManageDepartments,
        canManageDoctors,
        canManagePatients,
        canManageWelfare,
        canManageProcedures,
        canManageFees,
        canViewReports,
      },
    })

    res.status(201).json({ message: "Role created successfully", role })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

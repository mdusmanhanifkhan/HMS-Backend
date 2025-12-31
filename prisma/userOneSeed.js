import prisma from "../DB/db.config.js";
import bcrypt from "bcryptjs";

async function main() {
  // 1️⃣ Check if "patientManager" role exists
  let patientRole = await prisma.role.findUnique({
    where: { name: "patientManager" },
  });

  if (!patientRole) {
    patientRole = await prisma.role.create({
      data: {
        name: "patientManager",
        description: "Can manage patients only",
        canManageDepartments: false,
        canManageDoctors: false,
        canManagePatients: true,  // ✅ Only this is true
        canManageWelfare: false,
        canManageProcedures: false,
        canManageFees: false,
        canViewReports: false,
      },
    });

  }

  // 2️⃣ Check if user1 exists
  const existingUser = await prisma.user.findUnique({
    where: { email: "user1@system.com" },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("user123", 10);

    await prisma.user.create({
      data: {
        name: "User One",
        email: "user1@system.com",
        password: hashedPassword,
        roleId: patientRole.id,
      },
    });

  } 
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    process.exit(1);
  });

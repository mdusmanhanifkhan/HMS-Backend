
import prisma from "../DB/db.config.js";
import bcrypt from "bcryptjs";

async function main() {
  // --- Superadmin ---
  let adminRole = await prisma.role.findUnique({ where: { name: "superadmin" } });
  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: {
        name: "superadmin",
        description: "Full system access",
        canManageDepartments: true,
        canManageDoctors: true,
        canManagePatients: true,
        canManageWelfare: true,
        canManageProcedures: true,
        canManageFees: true,
        canViewReports: true,
      },
    });
  }

  const superAdmin = await prisma.user.findUnique({ where: { email: "superadmin@system.com" } });
  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash("superadmin123", 10);
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "superadmin@system.com",
        password: hashedPassword,
        roleId: adminRole.id,
      },
    });
    console.log("Super Admin user created");
  }

  // --- User1 ---
  let patientRole = await prisma.role.findUnique({ where: { name: "patientManager" } });
  if (!patientRole) {
    patientRole = await prisma.role.create({
      data: {
        name: "patientManager",
        description: "Can manage patients only",
        canManageDepartments: false,
        canManageDoctors: false,
        canManagePatients: true,
        canManageWelfare: false,
        canManageProcedures: false,
        canManageFees: false,
        canViewReports: false,
      },
    });
  }

  const user1 = await prisma.user.findUnique({ where: { email: "user1@system.com" } });
  if (!user1) {
    const hashedPassword = await bcrypt.hash("user1234", 10);
    await prisma.user.create({
      data: {
        name: "User One",
        email: "user1@system.com",
        password: hashedPassword,
        roleId: patientRole.id,
      },
    });
    console.log("User1 created with patientManager role");
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

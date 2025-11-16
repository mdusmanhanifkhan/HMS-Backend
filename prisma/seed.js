import prisma from "../DB/db.config.js";
import bcrypt from "bcryptjs";

async function main() {
  // Check if admin role exists
  let adminRole = await prisma.role.findUnique({
    where: { name: "superadmin" }
  });

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
      }
    });
  }

  // Check if a superadmin user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: "superadmin@system.com" }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("superadmin123", 10);

    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "superadmin@system.com",
        password: hashedPassword,
        roleId: adminRole.id,
      }
    });

    console.log("Super Admin user created");
  } else {
    console.log("Super Admin already exists");
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

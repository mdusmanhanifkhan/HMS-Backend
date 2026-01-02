import prisma from "../DB/db.config.js";
import bcrypt from "bcryptjs";

async function ensureRole(name, description, permissions) {
  let role = await prisma.role.findUnique({ where: { name } });

  if (!role) {
    role = await prisma.role.create({
      data: { name, description, ...permissions },
    });
    console.log(`Created role: ${name}`);
  } else {
    role = await prisma.role.update({
      where: { name },
      data: { description, ...permissions },
    });
    console.log(`Updated role: ${name}`);
  }

  return role;
}

async function ensureUser(email, name, password, roleId) {
  const user = await prisma.user.findUnique({ where: { email } });
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!user) {
    await prisma.user.create({
      data: { email, name, password: hashedPassword, roleId },
    });
    console.log(`Created user: ${email}`);
  } else {
    await prisma.user.update({
      where: { email },
      data: { name, password: hashedPassword, roleId },
    });
    console.log(`Updated user: ${email}`);
  }
}

async function main() {
  const adminRole = await ensureRole("superadmin", "Full system access", {
    canManageDepartments: true,
    canManageDoctors: true,
    canManagePatients: true,
    canManagePatientsHistory: true,
    canManageWelfare: true,
    canManageProcedures: true,
    canManageFees: true,
    canViewReports: true,
  });

  const patientRole = await ensureRole(
    "patientManager",
    "Can manage patients only",
    {
      canManageDepartments: false,
      canManageDoctors: false,
      canManagePatients: true,
      canManagePatientsHistory: true,
      canManageWelfare: false,
      canManageProcedures: false,
      canManageFees: false,
      canViewReports: false,
    }
  );

  await ensureUser(
    "superadmin@system.com",
    "Super Admin",
    "superadmin@01",
    adminRole.id
  );

  await ensureUser(
    "reception@system.com",
    "Reception",
    "Hikarimed@01",
    patientRole.id
  );

  await ensureUser(
    "reception01@system.com",
    "Reception One",
    "reception@01",
    patientRole.id
  );

  await ensureUser(
    "reception02@system.com",
    "Reception Two",
    "reception@02",
    patientRole.id
  );
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

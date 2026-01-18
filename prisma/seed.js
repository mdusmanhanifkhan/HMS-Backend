import prisma from "../DB/db.config.js";
import bcrypt from "bcryptjs";

async function ensureRole(name, description, permissions) {
  try {
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
  } catch (error) {
    console.error(`Error in ensureRole(${name}):`, error);
    throw error;
  }
}

async function ensureUser(email, name, password, roleId) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, password: hashedPassword, roleId },
      });
      console.log(`Created user: ${email}`);
    } else {
      user = await prisma.user.update({
        where: { email },
        data: { name, password: hashedPassword, roleId },
      });
      console.log(`Updated user: ${email}`);
    }
    return user;
  } catch (error) {
    console.error(`Error in ensureUser(${email}):`, error);
    throw error;
  }
}

async function main() {
  try {
    const adminRole = await ensureRole("superadmin", "Full system access", {
      canManageDepartments: true,
      canManageDoctors: true,
      canManagePatients: true,
      canManagePatientsHistory: true,
      canManageWelfare: true,
      canManageProcedures: true,
      canManageFees: true,
      canViewReports: true,
      canManageFinanceReport:true,
      canManageToken:true
    });

    const patientRole = await ensureRole("patientManager", "Can manage patients only", {
      canManageDepartments: false,
      canManageDoctors: false,
      canManagePatients: true,
      canManagePatientsHistory: true,
      canManageWelfare: false,
      canManageProcedures: false,
      canManageFees: false,
      canViewReports: false,
      canManageToken:true
    });

    await ensureUser("superadmin@system.com", "Super Admin", "superadmin@01", adminRole.id);
    await ensureUser("developer@system.com", "Developer", "developer@khan", patientRole.id);
    await ensureUser("reception01@system.com", "Reception One", "reception@01", patientRole.id);
    await ensureUser("reception02@system.com", "Reception Two", "reception@02", patientRole.id);
    await ensureUser("reception03@system.com", "Reception Three", "reception@03", patientRole.id);
    await ensureUser("reception04@system.com", "Reception Four", "reception@04", patientRole.id);
    await ensureUser("reception05@system.com", "Reception Five", "reception@05", patientRole.id);
    await ensureUser("reception06@system.com", "Reception Six", "reception@06", patientRole.id);

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

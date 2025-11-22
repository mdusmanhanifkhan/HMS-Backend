// import prisma from "../DB/db.config.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // ✅ REGISTER USER
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, roleId } = req.body;

//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) return res.status(400).json({ message: "Email already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.user.create({
//       data: { name, email, password: hashedPassword, roleId },
//       include: { role: true },
//     });

//     res.status(201).json({ message: "User created successfully", user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ LOGIN
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await prisma.user.findUnique({
//       where: { email },
//       include: { role: true },
//     });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user.id, role: user.role.name },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: { id: user.id, name: user.name, email: user.email, role: user.role.name },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ GET LOGGED-IN USER DETAILS (/me)
// export const getMe = async (req, res) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: req.user.id },
//       include: { role: true },
//     });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json({
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role.name,
//     });
//   } catch (error) {
//     console.error("Error in /me:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


import prisma from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Helper: Send error response with clean, consistent format
 */
const sendError = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

/**
 * LOGIN USER
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return sendError(res, 400, "Email and password are required");

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) return sendError(res, 404, "User not found");
    if (!user.status) return sendError(res, 403, "User account is disabled");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, 400, "Invalid credentials");

    // JWT
    const token = jwt.sign(
      { id: user.id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    return sendError(res, 500, "Server error during login");
  }
};

/**
 * GET LOGGED IN USER DETAILS
 */
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { role: true },
    });

    if (!user) return sendError(res, 404, "User not found");

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("GetMe Error:", error);
    return sendError(res, 500, "Server error");
  }
};

/**
 * CREATE USER (Only SuperAdmin OR roles with canCreateUsers permission)
 */
export const createUser = async (req, res) => {
  try {
    // const creatorRole = req.user.role;

    // if (creatorRole.name !== "SuperAdmin" && !creatorRole.canCreateUsers) {
    //   return sendError(res, 403, "You do not have permission to create users");
    // }

    const { name, email, password, roleId } = req.body;

    if (!name || !email || !password )
      return sendError(res, 400, "All fields (name, email, password, roleId) are required");

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return sendError(res, 400, "Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, roleId },
      include: { role: true },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    console.error("Create User Error:", error);
    return sendError(res, 500, "Server error while creating user");
  }
};

/**
 * GET ALL USERS (SuperAdmin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role.name !== "SuperAdmin")
      return sendError(res, 403, "Only SuperAdmin can view all users");

    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { id: "desc" },
    });

    res.json({ success: true, users });

  } catch (error) {
    console.error("Get All Users Error:", error);
    return sendError(res, 500, "Server error fetching users");
  }
};

/**
 * GET SINGLE USER (SuperAdmin only)
 */
export const getSingleUser = async (req, res) => {
  try {
    if (req.user.role.name !== "SuperAdmin")
      return sendError(res, 403, "Only SuperAdmin can access user details");

    const id = Number(req.params.id);
    const user = await prisma.user.findFirst({
      where: { id },
      include: { role: true },
    });

    if (!user) return sendError(res, 404, "User not found");

    res.json({ success: true, user });

  } catch (error) {
    console.error("Get Single User Error:", error);
    return sendError(res, 500, "Server error");
  }
};

/**
 * UPDATE USER BASIC INFO (SuperAdmin only)
 */
export const updateUser = async (req, res) => {
  try {
    if (req.user.role.name !== "SuperAdmin")
      return sendError(res, 403, "Only SuperAdmin can update users");

    const id = Number(req.params.id);
    const { name, email, status } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { name, email, status },
      include: { role: true },
    });

    res.json({
      success: true,
      message: "User updated successfully",
      user: updated,
    });

  } catch (error) {
    console.error("Update User Error:", error);
    return sendError(res, 500, "Server error updating user");
  }
};

/**
 * UPDATE USER ROLE (SuperAdmin only)
 */
export const updateUserRole = async (req, res) => {
  try {
    if (req.user.role.name !== "SuperAdmin")
      return sendError(res, 403, "Only SuperAdmin can change roles");

    const id = Number(req.params.id);
    const { roleId } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { roleId },
      include: { role: true },
    });

    res.json({
      success: true,
      message: "User role updated successfully",
      user: updated,
    });

  } catch (error) {
    console.error("Update User Role Error:", error);
    return sendError(res, 500, "Server error updating role");
  }
};

/**
 * DELETE USER (Soft Delete)
 */
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role.name !== "SuperAdmin")
      return sendError(res, 403, "Only SuperAdmin can delete users");

    const id = Number(req.params.id);

    await prisma.user.update({
      where: { id },
      data: { status: false },
    });

    res.json({
      success: true,
      message: "User disabled successfully",
    });

  } catch (error) {
    console.error("Delete User Error:", error);
    return sendError(res, 500, "Server error deleting user");
  }
};

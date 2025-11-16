import jwt from "jsonwebtoken";
import prisma from "../DB/db.config.js";

// ✅ PROTECT ROUTE
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ AUTHORIZE BY PERMISSION
export const authorize = (permission) => {
  return (req, res, next) => {
    if (!req.user?.role?.[permission]) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

import prisma from "../DB/db.config.js";
import { Prisma } from "@prisma/client";
// Constants
const NAME_MAX = 100;
const IDCARD_MAX = 20;
const PHONE_MAX = 20;
const ADDRESS_MAX = 255;

// Helper for structured error response
const sendError = (res, status, general_error, errors = {}) => {
  return res.status(status).json({ status, general_error, errors });
};

// Validation helper for Patient
const validatePatientInput = (patient) => {
  const errors = {};
  const missingFields = [];

  const requiredFields = ["name", "gender", "age"];
  requiredFields.forEach((field) => {
    if (!patient[field]) missingFields.push(field);
  });

  if (patient.name && patient.name.length > NAME_MAX)
    errors.name = `Name exceeds max length (${NAME_MAX})`;
  if (patient.cnicNumber && patient.cnicNumber.length > IDCARD_MAX)
    errors.cnicNumber = `CNIC exceeds max length (${IDCARD_MAX})`;
  if (patient.phoneNumber && patient.phoneNumber.length > PHONE_MAX)
    errors.phoneNumber = `Phone number exceeds max length (${PHONE_MAX})`;
  if (patient.address && patient.address.length > ADDRESS_MAX)
    errors.address = `Address exceeds max length (${ADDRESS_MAX})`;

  return { errors, missingFields };
};

export async function generateSequentialPatientId(tx) {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const prefix = Number(`${year}${month}00000`);
  const prefixEnd = Number(`${year}${month}99999`);

  const last = await tx.patient.findFirst({
    where: {
      patientId: {
        gte: prefix,
        lte: prefixEnd,
      },
    },
    orderBy: { patientId: "desc" },
    select: { patientId: true },
  });

  if (last && last.patientId >= prefixEnd) {
    throw new Error("Monthly patientId limit reached");
  }

  return last ? last.patientId + 1 : prefix + 1;
}

export const createPatient = async (req, res) => {
  try {
    const {
      name,
      guardianName,
      gender,
      age,
      maritalStatus,
      bloodGroup,
      phoneNumber,
      cnicNumber,
      address,
      createdByUserId,
    } = req.body;

    const { errors, missingFields } = validatePatientInput(req.body);
    if (missingFields.length > 0) {
      return sendError(
        res,
        400,
        `Validation failed: ${missingFields.join(", ")}`,
        errors
      );
    }

    const patient = await prisma.$transaction(
      async (tx) => {
        const patientId = await generateSequentialPatientId(tx);

        return tx.patient.create({
          data: {
            patientId,
            name,
            guardianName,
            gender,
            age: Number(age),
            maritalStatus,
            bloodGroup,
            phoneNumber,
            cnicNumber,
            address,
            createdByUserId,
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    return res.status(201).json({
      status: 201,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    // Graceful duplicate handling (last line of defense)
    if (error.code === "P2002") {
      return sendError(res, 409, "Patient ID conflict, please retry");
    }

    console.error(error);
    return sendError(res, 500, "Internal server error");
  }
};


// ✅ Get all patients (with welfare info)
export const getPatients = async (req, res) => {
  try {
    const { search } = req.query;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { guardianName: { contains: search, mode: "insensitive" } },
            { cnicNumber: { contains: search, mode: "insensitive" } },
            { phoneNumber: { contains: search, mode: "insensitive" } },
            { patientId: { equals: Number(search) || 0 } },
          ],
        }
      : {};

    const patients = await prisma.patient.findMany({
      where,
      include: {
        welfareRecord: {
          select: {
            welfareCategory: true,
            discountType: true,
            discountPercentage: true,
            startDate: true,
            endDate: true,
          },
        },
      },
      orderBy: { patientId: "desc" },
    });

    if (!patients.length)
      return sendError(
        res,
        404,
        search ? `No patients match "${search}"` : "No patients found"
      );

    const today = new Date();
    const formatted = patients.map((p) => {
      const welfare = p.welfareRecord;
      const isActive =
        welfare &&
        (!welfare.startDate || new Date(welfare.startDate) <= today) &&
        (!welfare.endDate || new Date(welfare.endDate) >= today);

      return {
        ...p,
        isWelfare: !!welfare,
        welfareCategory: welfare?.welfareCategory || null,
        discountType: welfare?.discountType || null,
        discountApplicable: isActive ? welfare.discountPercentage : 0,
        discountStatus: isActive ? "Active" : welfare ? "Expired" : "None",
      };
    });

    return res.status(200).json({
      status: 200,
      message: "Patients retrieved successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// ✅ Get single patient by patientId (MR Number)
export const getPatientById = async (req, res) => {
  try {
    const patientId = Number(req.params.id);
    if (isNaN(patientId)) return sendError(res, 400, "Invalid patient ID");


    const patient = await prisma.patient.findUnique({
      where: { patientId },
      include: { welfareRecord: true },
    });

    if (!patient) return sendError(res, 404, "Patient not found");

    const today = new Date();
    const welfare = patient.welfareRecord;
    const isActive =
      welfare &&
      (!welfare.startDate || new Date(welfare.startDate) <= today) &&
      (!welfare.endDate || new Date(welfare.endDate) >= today);

    const result = {
      ...patient,
      isWelfare: !!welfare,
      welfareCategory: welfare?.welfareCategory || null,
      discountType: welfare?.discountType || null,
      discountApplicable: isActive ? welfare.discountPercentage : 0,
      discountStatus: isActive ? "Active" : welfare ? "Expired" : "None",
    };

    return res.status(200).json({
      status: 200,
      message: "Patient retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// ✅ Update patient (by patientId)
export const updatePatient = async (req, res) => {
  try {
    const patientId = Number(req.params.id);
    if (isNaN(patientId)) return sendError(res, 400, "Invalid patient ID");

    const patient = await prisma.patient.findUnique({ where: { patientId } });
    if (!patient) return sendError(res, 404, "Patient not found");

    const {
      name,
      guardianName,
      gender,
      age,
      maritalStatus,
      bloodGroup,
      phoneNumber,
      cnicNumber,
      address,
    } = req.body;

    const { errors } = validatePatientInput(req.body);
    if (Object.keys(errors).length > 0)
      return sendError(res, 400, "Validation failed", errors);

    const updatedPatient = await prisma.patient.update({
      where: { patientId },
      data: {
        name,
        guardianName,
        gender,
        age: Number(age),
        maritalStatus,
        bloodGroup,
        phoneNumber,
        cnicNumber,
        address,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// ✅ Delete patient (by patientId)
export const deletePatient = async (req, res) => {
  try {
    const patientId = Number(req.params.id);
    if (isNaN(patientId)) return sendError(res, 400, "Invalid patient ID");

    const patient = await prisma.patient.findUnique({ where: { patientId } });
    if (!patient) return sendError(res, 404, "Patient not found");

    await prisma.patient.delete({ where: { patientId } });

    return res
      .status(200)
      .json({ status: 200, message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// ✅ Search patients with optional filters and pagination
export const searchPatients = async (req, res) => {
  try {
    const { name, patientId, cnic, phone, page, limit } = req.query;

    // ✅ Pagination defaults
    const currentPage = page && Number(page) > 0 ? Number(page) : 1;
    const pageSize = limit && Number(limit) > 0 ? Number(limit) : 20;
    const skip = (currentPage - 1) * pageSize;

    // ✅ Build dynamic filter
    const filters = { OR: [] };

    if (name) filters.OR.push({ name: { contains: name, mode: "insensitive" } });
    if (patientId && !isNaN(Number(patientId))) filters.OR.push({ patientId: Number(patientId) });
    if (cnic) filters.OR.push({ cnicNumber: { contains: cnic, mode: "insensitive" } });
    if (phone) filters.OR.push({ phoneNumber: { contains: phone, mode: "insensitive" } });

    const whereCondition = filters.OR.length ? filters : undefined;

    // ✅ Fetch patients and total count in parallel
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where: whereCondition,
        include: {
          welfareRecord: {
            select: {
              welfareCategory: true,
              discountType: true,
              discountPercentage: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { patientId: "desc" },
      }),
      prisma.patient.count({ where: whereCondition }),
    ]);

    // ✅ Format welfare info
    const today = new Date();
    const formatted = patients.map((p) => {
      const welfare = p.welfareRecord;
      const isActive =
        welfare &&
        (!welfare.startDate || new Date(welfare.startDate) <= today) &&
        (!welfare.endDate || new Date(welfare.endDate) >= today);

      return {
        ...p,
        isWelfare: !!welfare,
        welfareCategory: welfare ? welfare.welfareCategory : null,
        discountType: welfare ? welfare.discountType : null,
        discountApplicable: isActive ? welfare.discountPercentage : 0,
        discountStatus: isActive ? "Active" : welfare ? "Expired" : "None",
      };
    });

    return res.status(200).json({
      status: 200,
      message: formatted.length ? "Patients found successfully" : "No patients found",
      data: formatted,
      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasMore: skip + formatted.length < total,
      },
    });
  } catch (error) {
    console.error("Error searching patients:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};


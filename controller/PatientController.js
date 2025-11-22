import prisma from "../DB/db.config.js";

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

const generateSequentialPatientId = async () => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2); // e.g. "25"
  const month = String(now.getMonth() + 1).padStart(2, "0"); // e.g. "11"
  const prefix = `${year}${month}`; // "2511"

  // Find the latest patient for this month
  const latestPatient = await prisma.patient.findFirst({
    where: {
      patientId: {
        gte: Number(prefix + "00"), // >= 251100
        lt: Number(prefix + "99"), // < 251199
      },
    },
    orderBy: { patientId: "desc" },
  });

  const nextNumber = latestPatient?.patientId
    ? (latestPatient.patientId % 100) + 1
    : 1;

  const patientId = Number(`${prefix}${String(nextNumber).padStart(2, "0")}`);
  return patientId;
};

// ✅ Create Patient
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
    } = req.body;

    const { errors, missingFields } = validatePatientInput(req.body);
    if (missingFields.length > 0)
      return sendError(
        res,
        400,
        `Validation failed: ${missingFields.join(", ")} ${
          missingFields.length > 1 ? "are required" : "is required"
        }`,
        errors
      );

    // Check duplicates
    const existing = await prisma.patient.findFirst({
      where: { OR: [{ cnicNumber }, { phoneNumber }] },
    });
    if (existing) {
      const dupErrors = {};
      if (existing.cnicNumber === cnicNumber)
        dupErrors.cnicNumber = "CNIC already exists";
      if (existing.phoneNumber === phoneNumber)
        dupErrors.phoneNumber = "Phone number already exists";
      return sendError(res, 409, "Duplicate patient", dupErrors);
    }

    // ✅ Generate custom numeric MR number
    const patientId = await generateSequentialPatientId();

    // Create patient
    const patient = await prisma.patient.create({
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
      },
    });

    return res.status(201).json({
      status: 201,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    console.error("Error creating patient:", error);
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
      orderBy: { createdAt: "desc" },
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

    console.log(patient)
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

// ✅ Search patients with optional filters
export const searchPatients = async (req, res) => {
  try {
    // Get filter query params
    const { name, patientId, cnic, phone } = req.query;

    // Build dynamic filter
    const filters = { OR: [] };

    if (name) {
      filters.OR.push({ name: { contains: name, mode: 'insensitive' } });
    }
    if (patientId && !isNaN(Number(patientId))) {
      filters.OR.push({ patientId: Number(patientId) });
    }
    if (cnic) {
      filters.OR.push({ cnicNumber: { contains: cnic } });
    }
    if (phone) {
      filters.OR.push({ phoneNumber: { contains: phone } });
    }

    // If no filters provided, fetch all patients
    const patients = await prisma.patient.findMany({
      where: filters.OR.length ? filters : undefined,
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
    });

    if (!patients || patients.length === 0) {
      return res.status(200).json({
        status: 200,
        message: 'No patients found matching your query',
        data: [],
      });
    }

    const today = new Date();
    const results = patients.map((patient) => {
      const welfare = patient.welfareRecord;
      const isActive =
        welfare &&
        (!welfare.startDate || new Date(welfare.startDate) <= today) &&
        (!welfare.endDate || new Date(welfare.endDate) >= today);

      return {
        ...patient,
        isWelfare: !!welfare,
        welfareCategory: welfare?.welfareCategory || null,
        discountType: welfare?.discountType || null,
        discountApplicable: isActive ? welfare.discountPercentage : 0,
        discountStatus: isActive ? 'Active' : welfare ? 'Expired' : 'None',
      };
    });

    return res.status(200).json({
      status: 200,
      message: 'Patients found successfully',
      data: results,
    });
  } catch (error) {
    console.error('Error searching patients:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
};

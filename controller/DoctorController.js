import prisma from "../DB/db.config.js";

// Constants
const NAME_MAX = 100;
const IDCARD_MAX = 20;
const PHONE_MAX = 20;
const EMAIL_MAX = 100;
const ADDRESS_MAX = 255;
const SPECIALIZATION_MAX = 100;
const QUALIFICATION_MAX = 100;
const SUBSPEC_MAX = 100;
const LANGUAGES_MAX = 100;
const AVAILABLE_DAYS_MAX = 50;
const TIMING_MAX = 10;

// Helper for structured error response
const sendError = (res, status, general_error, errors = {}) => {
  return res.status(status).json({ status, general_error, errors });
};

// Validation helper for doctor
const validateDoctorInput = (doctor) => {
  const errors = {};
  const missingFields = [];

  const requiredFields = [
    "name",
    "gender",
    "age",
    "idCard",
    "phoneNumber",
    "email",
    "joinDate",
    "employmentType",
    "maxPatients",
  ];
  requiredFields.forEach((field) => {
    if (!doctor[field]) missingFields.push(field);
  });

  if (doctor.name && doctor.name.length > NAME_MAX)
    errors.name = `Name exceeds max length (${NAME_MAX})`;
  if (doctor.idCard && doctor.idCard.length > IDCARD_MAX)
    errors.idCard = `ID Card exceeds max length (${IDCARD_MAX})`;
  if (doctor.phoneNumber && doctor.phoneNumber.length > PHONE_MAX)
    errors.phoneNumber = `Phone number exceeds max length (${PHONE_MAX})`;
  if (doctor.email && doctor.email.length > EMAIL_MAX)
    errors.email = `Email exceeds max length (${EMAIL_MAX})`;
  if (doctor.address && doctor.address.length > ADDRESS_MAX)
    errors.address = `Address exceeds max length (${ADDRESS_MAX})`;
  if (
    doctor.specialization &&
    doctor.specialization.length > SPECIALIZATION_MAX
  )
    errors.specialization = `Specialization exceeds max length (${SPECIALIZATION_MAX})`;
  if (doctor.qualification && doctor.qualification.length > QUALIFICATION_MAX)
    errors.qualification = `Qualification exceeds max length (${QUALIFICATION_MAX})`;
  if (doctor.subSpecialities && doctor.subSpecialities.length > SUBSPEC_MAX)
    errors.subSpecialities = `SubSpecialities exceeds max length (${SUBSPEC_MAX})`;
  if (doctor.languages && doctor.languages.length > LANGUAGES_MAX)
    errors.languages = `Languages exceeds max length (${LANGUAGES_MAX})`;
  if (doctor.availableDays && doctor.availableDays.length > AVAILABLE_DAYS_MAX)
    errors.availableDays = `Available days exceeds max length (${AVAILABLE_DAYS_MAX})`;
  if (doctor.timingFrom && doctor.timingFrom.length > TIMING_MAX)
    errors.timingFrom = `TimingFrom exceeds max length (${TIMING_MAX})`;
  if (doctor.timingTo && doctor.timingTo.length > TIMING_MAX)
    errors.timingTo = `TimingTo exceeds max length (${TIMING_MAX})`;

  return { errors, missingFields };
};

// Create Doctor
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      guardianName,
      gender,
      dateOfBirth,
      age,
      idCard,
      phoneNumber,
      email,
      address,
      specialization,
      qualification,
      subSpecialities,
      experience,
      languages,
      joinDate,
      employmentType,
      availableDays,
      timingFrom,
      timingTo,
      shiftType,
      maxPatients,
      departmentIds,
    } = req.body;

    const { errors, missingFields } = validateDoctorInput(req.body);
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
    const existing = await prisma.doctor.findFirst({
      where: { OR: [{ idCard }, { phoneNumber }, { email }] },
    });
    if (existing) {
      const dupErrors = {};
      if (existing.idCard === idCard)
        dupErrors.idCard = "ID Card already exists";
      if (existing.phoneNumber === phoneNumber)
        dupErrors.phoneNumber = "Phone number already exists";
      if (existing.email === email) dupErrors.email = "Email already exists";
      return sendError(res, 409, "Duplicate doctor", dupErrors);
    }

    // Create doctor
    const doctor = await prisma.doctor.create({
      data: {
        name,
        guardianName,
        gender,
        dateOfBirth,
        age,
        idCard,
        phoneNumber,
        email,
        address,
        specialization,
        qualification,
        subSpecialities,
        experience,
        languages,
        joinDate,
        employmentType,
        availableDays,
        timingFrom,
        timingTo,
        shiftType,
        maxPatients,
        departmentLinks: departmentIds?.length
          ? {
              create: departmentIds.map((deptId) => ({
                departmentId: Number(deptId),
              })),
            }
          : undefined,
      },
      include: { departmentLinks: true },
    });

    return res
      .status(201)
      .json({
        status: 201,
        message: "Doctor created successfully",
        data: doctor,
      });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// Get all doctors with optional search
export const getDoctors = async (req, res) => {
  try {
    const { search } = req.query;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { specialization: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        departmentLinks: { include: { department: true } },
        feeLinks: { include: { feePolicy: true, procedure: true } },
      },
      orderBy: { name: "asc" },
    });

    if (!doctors.length)
      return sendError(
        res,
        404,
        search ? `No doctors match "${search}"` : "No doctors found"
      );

    return res
      .status(200)
      .json({
        status: 200,
        message: "Doctors retrieved successfully",
        data: doctors,
      });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// Get single doctor
export const getDoctorById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendError(res, 400, "Invalid doctor ID");

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        departmentLinks: { include: { department: true } },
        feeLinks: { include: { feePolicy: true, procedure: true } },
      },
    });
    if (!doctor) return sendError(res, 404, "Doctor not found");

    return res
      .status(200)
      .json({
        status: 200,
        message: "Doctor retrieved successfully",
        data: doctor,
      });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendError(res, 400, "Invalid doctor ID");

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) return sendError(res, 404, "Doctor not found");

    const {
      name,
      gender,
      age,
      idCard,
      phoneNumber,
      email,
      address,
      specialization,
      qualification,
      subSpecialities,
      experience,
      languages,
      joinDate,
      employmentType,
      availableDays,
      timingFrom,
      timingTo,
      shiftType,
      maxPatients,
      departmentIds,
    } = req.body;

    const { errors } = validateDoctorInput(req.body);
    if (Object.keys(errors).length > 0)
      return sendError(res, 400, "Validation failed", errors);

    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: {
        name,
        gender,
        age,
        idCard,
        phoneNumber,
        email,
        address,
        specialization,
        qualification,
        subSpecialities,
        experience,
        languages,
        joinDate,
        employmentType,
        availableDays,
        timingFrom,
        timingTo,
        shiftType,
        maxPatients,
        departmentLinks: departmentIds?.length
          ? {
              deleteMany: {},
              create: departmentIds.map((deptId) => ({
                departmentId: Number(deptId),
              })),
            }
          : undefined,
      },
      include: { departmentLinks: true },
    });

    return res
      .status(200)
      .json({
        status: 200,
        message: "Doctor updated successfully",
        data: updatedDoctor,
      });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendError(res, 400, "Invalid doctor ID");

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) return sendError(res, 404, "Doctor not found");

    await prisma.doctor.delete({ where: { id } });

    return res
      .status(200)
      .json({ status: 200, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return sendError(res, 500, "Internal server error");
  }
};

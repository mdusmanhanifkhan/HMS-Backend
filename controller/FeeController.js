import prisma from "../DB/db.config.js";

const sendError = (res, status, general_error, errors = {}) => {
  return res.status(status).json({ status, general_error, errors });
};

// Create / assign fee to doctor
export const createFee = async (req, res) => {
  try {
    const { doctorId, procedureId, feePolicyId, overrideFixedAmount, overrideDoctorPercentage, overrideHospitalPercentage } = req.body;
    const missing = [];
    if (!doctorId) missing.push("doctorId");
    if (!procedureId) missing.push("procedureId");
    if (!feePolicyId) missing.push("feePolicyId");

    if (missing.length) return sendError(res, 400, `Validation failed: ${missing.join(", ")} required`);

    // Check related records
    const doctor = await prisma.doctor.findUnique({ where: { id: Number(doctorId) } });
    if (!doctor) return sendError(res, 404, "Doctor not found");

    const procedure = await prisma.procedure.findUnique({ where: { id: Number(procedureId) } });
    if (!procedure) return sendError(res, 404, "Procedure not found");

    const feePolicy = await prisma.feePolicy.findUnique({ where: { id: Number(feePolicyId) } });
    if (!feePolicy) return sendError(res, 404, "Fee policy not found");

    const existing = await prisma.doctorProcedureFee.findUnique({
      where: { doctorId_procedureId: { doctorId: Number(doctorId), procedureId: Number(procedureId) } },
    });
    if (existing) return sendError(res, 409, "Fee already assigned to this doctor for this procedure");

    const fee = await prisma.doctorProcedureFee.create({
      data: {
        doctorId: Number(doctorId),
        procedureId: Number(procedureId),
        feePolicyId: Number(feePolicyId),
        overrideFixedAmount,
        overrideDoctorPercentage,
        overrideHospitalPercentage,
      },
      include: { doctor: true, procedure: true, feePolicy: true },
    });

    return res.status(201).json({ status: 201, message: "Fee assigned successfully", data: fee });
  } catch (error) {
    console.error("Error assigning fee:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// Get all fees with optional search
export const getFees = async (req, res) => {
  try {
    const { search } = req.query;
    const where = search
      ? {
          OR: [ 
            { doctor: { name: { contains: search, mode: "insensitive" } } },
            { procedure: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};

    const fees = await prisma.doctorProcedureFee.findMany({
      where,
      include: { doctor: true, procedure: true, feePolicy: true },
    });

    if (!fees.length) return sendError(res, 404, search ? `No fees match "${search}"` : "No fees found");

    return res.status(200).json({ status: 200, message: "Fees retrieved successfully", data: fees });
  } catch (error) {
    console.error("Error fetching fees:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// Delete fee
export const deleteFee = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendError(res, 400, "Invalid fee ID");

    const fee = await prisma.doctorProcedureFee.findUnique({ where: { id } });
    if (!fee) return sendError(res, 404, "Fee not found");

    await prisma.doctorProcedureFee.delete({ where: { id } });

    return res.status(200).json({ status: 200, message: "Fee deleted successfully" });
  } catch (error) {
    console.error("Error deleting fee:", error);
    return sendError(res, 500, "Internal server error");
  }
};

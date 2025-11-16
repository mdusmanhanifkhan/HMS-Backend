// import prisma from "../DB/db.config.js";

// const sendError = (res, status, general_error, errors = {}) => {
//   return res.status(status).json({ status, general_error, errors });
// };

// // Create / assign fee to doctor
// export const createFee = async (req, res) => {
//   try {
//     const { doctorId, procedureId, feePolicyId, overrideFixedAmount, overrideDoctorPercentage, overrideHospitalPercentage } = req.body;
//     const missing = [];
//     if (!doctorId) missing.push("doctorId");
//     if (!procedureId) missing.push("procedureId");
//     // if (!feePolicyId) missing.push("feePolicyId");

//     if (missing.length) return sendError(res, 400, `Validation failed: ${missing.join(", ")} required`);

//     // Check related records
//     const doctor = await prisma.doctor.findUnique({ where: { id: Number(doctorId) } });
//     if (!doctor) return sendError(res, 404, "Doctor not found");

//     const procedure = await prisma.procedure.findUnique({ where: { id: Number(procedureId) } });
//     if (!procedure) return sendError(res, 404, "Procedure not found");

//     // const feePolicy = await prisma.feePolicy.findUnique({ where: { id: Number(feePolicyId) } });
//     // if (!feePolicy) return sendError(res, 404, "Fee policy not found");

//     const existing = await prisma.doctorProcedureFee.findUnique({
//       where: { doctorId_procedureId: { doctorId: Number(doctorId), procedureId: Number(procedureId) } },
//     });
//     if (existing) return sendError(res, 409, "Fee already assigned to this doctor for this procedure");

//     const fee = await prisma.doctorProcedureFee.create({
//       data: {
//         doctorId: Number(doctorId),
//         procedureId: Number(procedureId),
//         feePolicyId: Number(feePolicyId),
//         overrideFixedAmount,
//         overrideDoctorPercentage,
//         overrideHospitalPercentage,
//       },
//       include: { doctor: true, procedure: true, feePolicy: true },
//     });

//     return res.status(201).json({ status: 201, message: "Fee assigned successfully", data: fee });
//   } catch (error) {
//     console.error("Error assigning fee:", error);
//     return sendError(res, 500, "Internal server error");
//   }
// };

// // Get all fees with optional search
// export const getFees = async (req, res) => {
//   try {
//     const { search } = req.query;
//     const where = search
//       ? {
//           OR: [ 
//             { doctor: { name: { contains: search, mode: "insensitive" } } },
//             { procedure: { name: { contains: search, mode: "insensitive" } } },
//           ],
//         }
//       : {};

//     const fees = await prisma.doctorProcedureFee.findMany({
//       where,
//       include: { doctor: true, procedure: true, feePolicy: true },
//     });

//     if (!fees.length) return sendError(res, 404, search ? `No fees match "${search}"` : "No fees found");

//     return res.status(200).json({ status: 200, message: "Fees retrieved successfully", data: fees });
//   } catch (error) {
//     console.error("Error fetching fees:", error);
//     return sendError(res, 500, "Internal server error");
//   }
// };

// // Delete fee
// export const deleteFee = async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     if (isNaN(id)) return sendError(res, 400, "Invalid fee ID");

//     const fee = await prisma.doctorProcedureFee.findUnique({ where: { id } });
//     if (!fee) return sendError(res, 404, "Fee not found");

//     await prisma.doctorProcedureFee.delete({ where: { id } });

//     return res.status(200).json({ status: 200, message: "Fee deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting fee:", error);
//     return sendError(res, 500, "Internal server error");
//   }
// };


import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * POST /api/doctor-fees
 * Body:
 * {
 *  doctorId, departmentId, procedureId,
 *  paymentType, doctorShare, hospitalShare, fixedPrice, description, status
 * }
 */
export const createDoctorFee = async (req, res) => {
  try {
    const {
      doctorId,
      departmentId,
      procedureId,
      paymentType,
      doctorShare,
      hospitalShare,
      fixedPrice,
      procedurePrice,
      description,
      status
    } = req.body

    // Basic validation
    if (!doctorId || !departmentId || !procedureId || !paymentType || !procedurePrice)
      return res.status(400).json({ message: 'Missing required fields' })

    // Check if already exists
    const existing = await prisma.doctorProcedureFee.findUnique({
      where: {
        doctorId_procedureId: { doctorId, procedureId },
      },
    })

    if (existing)
      return res
        .status(400)
        .json({ message: 'Fee already exists for this doctor and procedure' })

    // Create entry
    const newFee = await prisma.doctorProcedureFee.create({
      data: {
        doctorId,
        departmentId,
        procedureId,
        paymentType,
        description,
        status: status ?? true,

        procedurePrice,
        // Overrides — only set if provided
        overrideDoctorPercentage: doctorShare ? Number(doctorShare) : null,
        overrideHospitalPercentage: hospitalShare ? Number(hospitalShare) : null,
        overrideFixedAmount: fixedPrice ? Number(fixedPrice) : null,
      },
      include: {
        doctor: true,
        procedure: true,
        department: true,
      },
    })

    return res.status(201).json({
      message: 'Doctor Fee added successfully',
      data: newFee,
    })
  } catch (error) {
    console.error('Error creating doctor fee:', error)
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    })
  }
}

/**
 * GET /api/doctor-fees
 * Fetch all doctor fees
 */
export const getDoctorFees = async (req, res) => {
  try {
    const fees = await prisma.doctorProcedureFee.findMany({
      include: {
        doctor: { select: { id: true, name: true } },
        procedure: { select: { id: true, name: true } },
        department: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Map data to include payment info clearly
    const formattedFees = fees.map((fee) => ({
      id: fee.id,
      doctor: fee.doctor,
      procedure: fee.procedure,
      department: fee.department,
      paymentType: fee.paymentType,
      doctorShare: fee.overrideDoctorPercentage,
      hospitalShare: fee.overrideHospitalPercentage,
      fixedPrice: fee.overrideFixedAmount,
      procedurePrice:fee.procedurePrice,
      description: fee.description,
      status: fee.status,
      createdAt: fee.createdAt,
      updatedAt: fee.updatedAt,
    }))

    res.json({
      message: 'Doctor fees retrieved successfully',
      data: formattedFees,
    })
  } catch (error) {
    console.error('Error fetching doctor fees:', error)
    res.status(500).json({ message: 'Failed to fetch doctor fees' })
  }
}
import prisma from "../DB/db.config.js";

// export const createMedicalRecord = async (req, res) => {
//   try {
//     const { patientId, discount = 0, notes, items, createdByUserId } = req.body;

//     // Validate items
//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one medical record item is required",
//       });
//     }

//     // Find patient
//     const patient = await prisma.patient.findUnique({
//       where: { patientId: Number(patientId) }, // use 'id', not 'patientId' here
//     });

//     if (!patient) {
//       return res.status(404).json({
//         success: false,
//         message: `Patient with id ${patientId} not found`,
//       });
//     }

//     // Prepare items safely
//     const preparedItems = items.map((item) => {
//       const fee = Number(item.fee || 0);
//       const itemDiscount = Number(item.discount || 0);
//       return {
//         fee,
//         discount: itemDiscount,
//         finalFee: fee - itemDiscount, // always calculate finalFee
//         notes: item.notes || null,

//         // Connect relations
//         department: { connect: { id: Number(item.departmentId) } },
//         procedure: { connect: { id: Number(item.procedureId) } },
//         doctor: item.doctorId
//           ? { connect: { id: Number(item.doctorId) } }
//           : undefined,
//       };
//     });

//     // Calculate totals for the header
//     const totalFee = preparedItems.reduce((sum, item) => sum + item.fee, 0);
//     const finalFee =
//       preparedItems.reduce((sum, item) => sum + item.finalFee, 0) -
//       Number(discount);

//     // Create MedicalRecord with items
//     const medicalRecord = await prisma.medicalRecord.create({
//       data: {
//         patientId: patient.id,
//         totalFee,
//         discount: Number(discount),
//         finalFee,
//         notes: notes || null,
//         createdAt: new Date(),

//         userId: Number(createdByUserId),

//         // Items with relations
//         items: {
//           create: preparedItems,
//         },
//       },
//       include: {
//         patient: true,
//         items: {
//           include: {
//             department: true,
//             doctor: true,
//             procedure: true,
//           },
//         },
//       },
//     });

//     return res.status(201).json({
//       success: true,
//       data: {
//         id: medicalRecord.id,
//         patientId: medicalRecord.patientId,
//         recordDate: medicalRecord.recordDate,
//         totalFee: medicalRecord.totalFee,
//         discount: medicalRecord.discount,
//         finalFee: medicalRecord.finalFee,
//         notes: medicalRecord.notes,
//         createdAt: medicalRecord.createdAt,
//         patient: medicalRecord.patient,
//         items: medicalRecord.items,
//       },
//     });
//   } catch (error) {
//     console.error("createMedicalRecord error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Server error",
//     });
//   }
// };


export const createMedicalRecord = async (req, res) => {
  try {
    // ✅ Get user from JWT
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    const { patientId, discount = 0, notes, items } = req.body;

    // ✅ Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one medical record item is required",
      });
    }

    // ✅ Find patient
    const patient = await prisma.patient.findUnique({
      where: { patientId: Number(patientId) },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with id ${patientId} not found`,
      });
    }

    // ✅ Prepare items
    const preparedItems = items.map((item) => {
      const fee = Number(item.fee || 0);
      const itemDiscount = Number(item.discount || 0);

      return {
        fee,
        discount: itemDiscount,
        finalFee: fee - itemDiscount,
        notes: item.notes || null,

        department: { connect: { id: Number(item.departmentId) } },
        procedure: { connect: { id: Number(item.procedureId) } },
        doctor: item.doctorId
          ? { connect: { id: Number(item.doctorId) } }
          : undefined,
      };
    });

    // ✅ Calculate totals
    const totalFee = preparedItems.reduce((sum, i) => sum + i.fee, 0);
    const finalFee =
      preparedItems.reduce((sum, i) => sum + i.finalFee, 0) -
      Number(discount);

    // ✅ Create medical record
    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        patientId: patient.id,
        totalFee,
        discount: Number(discount),
        finalFee,
        notes: notes || null,

        // 🔥 THIS FIXES THE ERROR
        userId: userId,

        items: {
          create: preparedItems,
        },
      },
      include: {
        patient: true,
        items: {
          include: {
            department: true,
            doctor: true,
            procedure: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: medicalRecord,
    });
  } catch (error) {
    console.error("createMedicalRecord error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getMedicalRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { patientId: Number(patientId) },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        MedicalRecord: {
          orderBy: { recordDate: "desc" },
          include: {
            items: {
              include: {
                department: true,
                doctor: true,
                procedure: true,
              },
            },
          },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with id ${patientId} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      patient: {
        ...patient,
        totalVisits: patient.MedicalRecord.length,
      },
    });
  } catch (error) {
    console.error("getMedicalRecordsByPatient error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};



export const getMedicalRecords = async (req, res) => {
  try {
    // Fetch all patients who have at least 1 medical record
    const patientsWithVisits = await prisma.patient.findMany({
      where: {
        MedicalRecord: { some: {} }, // only patients with visits
      },
      select: {
        id: true,
        patientId: true,
        name: true,
        guardianName: true,
        gender: true,
        age: true,
        maritalStatus: true,
        bloodGroup: true,
        cnicNumber: true,
        phoneNumber: true,
        address: true,
        MedicalRecord: {
          select: {
            id: true,
            recordDate: true,
            totalFee: true,
            discount: true,
            finalFee: true,
            notes: true,
          },
          orderBy: { recordDate: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });

    // Add totalVisits count
    const data = patientsWithVisits.map((p) => ({
      ...p,
      totalVisits: p.MedicalRecord.length,
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("getMedicalRecords error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

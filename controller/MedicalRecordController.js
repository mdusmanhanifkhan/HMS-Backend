import prisma from "../DB/db.config.js";

// ✅ Add new medical history record
export const createMedicalHistory = async (req, res) => {
  try {
    const {
      patientId,
      departmentId,
      doctorId,
      procedureId,
      fee,
      discount,
      finalFee,
      notes,
    } = req.body;

    const createdByUserId = req.user?.id;
    if (!createdByUserId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const record = await prisma.medicalHistory.create({
      data: {
        patientId,
        departmentId,
        doctorId,
        procedureId,
        fee,
        discount,
        finalFee,
        notes,
        createdBy: { connect: { id: createdByUserId } },
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
        procedure: true,
        createdBy: true,
      },
    });

    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || error });
  }
};

// ✅ Get all medical history records for a patient
export const getMedicalHistoryByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await prisma.medicalHistory.findMany({
      where: { patientId: Number(patientId) },
      include: {
        patient: true,
        doctor: true,
        department: true,
        procedure: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { visitDate: "desc" },
    });

    if (!records.length) return res.status(404).json({ success: false, message: "No medical history found for this patient" });

    res.json({ success: true, data: { patient: records[0].patient, records } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

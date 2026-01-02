import prisma from "../DB/db.config.js";

// ✅ Add new medical record
export const createMedicalRecord = async (req, res) => {
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

    if (!createdByUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const record = await prisma.medicalRecord.create({
      data: {
        patientId: Number(patientId),
        departmentId: Number(departmentId),
        doctorId: Number(doctorId),
        procedureId: Number(procedureId),
        fee: Number(fee),
        discount: Number(discount) || 0,
        finalFee: Number(finalFee),
        notes: notes || null,
        createdByUserId, // this is the foreign key field in schema
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
        procedure: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || error });
  }
};

// ✅ Get all medical records for a patient
export const getMedicalRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await prisma.medicalRecord.findMany({
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

    if (!records.length) {
      return res.status(404).json({ success: false, message: "No medical records found for this patient" });
    }

    res.json({ success: true, data: { patient: records[0].patient, records } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

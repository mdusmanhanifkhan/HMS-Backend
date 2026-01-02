import prisma from "../DB/db.config.js";

// ✅ Add new medical record (maps hospital number to internal ID)
export const createMedicalRecord = async (req, res) => {
  try {
    const {
      patientId,       // hospital number
      departmentId,
      doctorId,
      procedureId,
      fee,
      discount,
      finalFee,
      notes,
    } = req.body;

    // 1️⃣ Find internal Patient.id from hospital patientId
    const patient = await prisma.patient.findUnique({
      where: { patientId: Number(patientId) }, // hospital number
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with patientId ${patientId} not found`,
      });
    }

    // 2️⃣ Create MedicalRecord using internal patient ID
    const record = await prisma.medicalRecord.create({
      data: {
        patientId: patient.id,       // ✅ internal PK
        departmentId: Number(departmentId),
        doctorId: Number(doctorId),
        procedureId: Number(procedureId),
        fee: Number(fee),
        discount: Number(discount) || 0,
        finalFee: Number(finalFee),
        notes: notes || null,
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
        procedure: true,
      },
    });

    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ✅ Get all medical records for a patient (using hospital number)
export const getMedicalRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    // 1️⃣ Find internal Patient.id first
    const patient = await prisma.patient.findUnique({
      where: { patientId: Number(patientId) }, // hospital number
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with patientId ${patientId} not found`,
      });
    }

    // 2️⃣ Get all MedicalRecords using internal ID
    const records = await prisma.medicalRecord.findMany({
      where: { patientId: patient.id }, // internal PK
      include: {
        patient: true,
        doctor: true,
        department: true,
        procedure: true,
      },
      orderBy: { visitDate: "desc" },
    });

    if (!records.length) {
      return res.status(404).json({
        success: false,
        message: "No medical records found for this patient",
      });
    }

    res.json({ success: true, data: { patient: records[0].patient, records } });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

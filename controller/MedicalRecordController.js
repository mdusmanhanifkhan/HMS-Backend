import prisma from "../DB/db.config.js";

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

    const patient = await prisma.patient.findUnique({
      where: { patientId: Number(patientId) },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with patientId ${patientId} not found`,
      });
    }

    const record = await prisma.medicalRecord.create({
      data: {
        patientId: patient.id,
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
      },
    });

    if (!patient)
      return res.status(404).json({
        success: false,
        message: `Patient with patientId ${patientId} not found`,
      });

    const records = await prisma.medicalRecord.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: true,
        department: true,
        procedure: true,
      },
      orderBy: { visitDate: "desc" },
    });

    return res.status(200).json({
      success: true,
      patient,
      records,
    });
  } catch (error) {
    console.error("getMedicalRecordsByPatient error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMedicalRecords = async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

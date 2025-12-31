import prisma from '../prismaClient.js'

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
    } = req.body

    const record = await prisma.medicalRecord.create({
      data: {
        patientId,
        departmentId,
        doctorId,
        procedureId,
        fee,
        discount,
        finalFee,
        notes,
      },
    })

    res.json({ success: true, data: record })
  } catch (error) {
    console.error('Error creating record:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ✅ Get all records for a patient
export const getMedicalRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params

    const records = await prisma.medicalRecord.findMany({
      where: { patientId: Number(patientId) },
      include: {
        doctor: true,
        department: true,
        procedure: true,
      },
      orderBy: { visitDate: 'desc' },
    })

    res.json({ success: true, data: records })
  } catch (error) {
    console.error('Error fetching records:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

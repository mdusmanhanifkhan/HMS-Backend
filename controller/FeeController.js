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

<<<<<<< HEAD
=======


>>>>>>> 8daaba6 (make some changes)
/**
 * PUT /api/doctor-fees/:id
 */
export const updateDoctorFee = async (req, res) => {
  try {
    const { id } = req.params

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
      status,
    } = req.body

    const fee = await prisma.doctorProcedureFee.findUnique({
      where: { id: Number(id) },
    })

    if (!fee)
      return res.status(404).json({ message: 'Doctor fee not found' })

    // Prevent duplicate fees for same doctor + procedure
    if (doctorId && procedureId) {
      const exists = await prisma.doctorProcedureFee.findUnique({
        where: {
          doctorId_procedureId: {
            doctorId,
            procedureId,
          },
        },
      })

      if (exists && exists.id !== fee.id)
        return res
          .status(400)
          .json({ message: 'Fee already exists for this doctor and procedure' })
    }

    const updated = await prisma.doctorProcedureFee.update({
      where: { id: Number(id) },
      data: {
        doctorId: doctorId ?? fee.doctorId,
        departmentId: departmentId ?? fee.departmentId,
        procedureId: procedureId ?? fee.procedureId,
        paymentType: paymentType ?? fee.paymentType,
        description: description ?? fee.description,
        status: status ?? fee.status,
        procedurePrice: procedurePrice ?? fee.procedurePrice,

        overrideDoctorPercentage: doctorShare !== undefined
          ? Number(doctorShare)
          : fee.overrideDoctorPercentage,

        overrideHospitalPercentage: hospitalShare !== undefined
          ? Number(hospitalShare)
          : fee.overrideHospitalPercentage,

        overrideFixedAmount: fixedPrice !== undefined
          ? Number(fixedPrice)
          : fee.overrideFixedAmount,
      },
      include: {
        doctor: true,
        procedure: true,
        department: true,
      },
    })

    return res.json({
      message: 'Doctor fee updated successfully',
      data: updated,
    })
  } catch (error) {
    console.error('Error updating doctor fee:', error)
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    })
  }
}


/**
 * DELETE /api/doctor-fees/:id
 */
export const deleteDoctorFee = async (req, res) => {
  try {
    const { id } = req.params

    const fee = await prisma.doctorProcedureFee.findUnique({
      where: { id: Number(id) },
    })

    if (!fee)
      return res.status(404).json({ message: 'Doctor fee not found' })

    await prisma.doctorProcedureFee.delete({
      where: { id: Number(id) },
    })

    return res.json({
      message: 'Doctor fee deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting doctor fee:', error)
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    })
  }
}

<<<<<<< HEAD

=======
>>>>>>> 8daaba6 (make some changes)
/**
 * GET /api/doctor-fees/:id
 * Fetch single doctor fee
 */
export const getSingleDoctorFee = async (req, res) => {
  try {
    const { id } = req.params

    const fee = await prisma.doctorProcedureFee.findUnique({
      where: { id: Number(id) },
      include: {
        doctor: { select: { id: true, name: true } },
        procedure: { select: { id: true, name: true } },
        department: { select: { id: true, name: true } },
      },
    })

    if (!fee)
      return res.status(404).json({ message: 'Doctor fee not found' })

    const formattedFee = {
      id: fee.id,
      doctor: fee.doctor,
      procedure: fee.procedure,
      department: fee.department,
      paymentType: fee.paymentType,
      doctorShare: fee.overrideDoctorPercentage,
      hospitalShare: fee.overrideHospitalPercentage,
      fixedPrice: fee.overrideFixedAmount,
      procedurePrice: fee.procedurePrice,
      description: fee.description,
      status: fee.status,
      createdAt: fee.createdAt,
      updatedAt: fee.updatedAt,
    }

    return res.json({
      message: 'Doctor fee retrieved successfully',
      data: formattedFee,
    })
  } catch (error) {
    console.error('Error fetching doctor fee:', error)
    return res.status(500).json({
      message: 'Failed to fetch doctor fee',
      error: error.message,
    })
  }
}
<<<<<<< HEAD
=======

>>>>>>> 8daaba6 (make some changes)

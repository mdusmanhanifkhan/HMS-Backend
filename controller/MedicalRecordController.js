import XLSX from "xlsx";
import prisma from "../DB/db.config.js";
import { buildPaginationResponse, getPagination } from "../utils/pagination.js";

export const createMedicalRecord = async (req, res) => {
  try {

    const userId = req.user?.id;

    console.log(userId);

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
      preparedItems.reduce((sum, i) => sum + i.finalFee, 0) - Number(discount);

    // ✅ Create medical record
    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        patientId: patient.id,
        totalFee,
        discount: Number(discount),
        finalFee,
        notes: notes || null,
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

export const createMedicalRecordPatients = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    const {
      patientId,
      recordDate,        // ✅ NEW
      discount = 0,
      notes,
      items,
    } = req.body;

    // ✅ Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one medical record item is required",
      });
    }

    // ✅ Validate recordDate (optional)
    let finalRecordDate = new Date();
    if (recordDate) {
      const parsedDate = new Date(recordDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid recordDate format",
        });
      }
      finalRecordDate = parsedDate;
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
      preparedItems.reduce((sum, i) => sum + i.finalFee, 0) - Number(discount);

    // ✅ Create medical record
    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        patientId: patient.id,
        recordDate: finalRecordDate,   // ✅ BACKDATED OR TODAY
        totalFee,
        discount: Number(discount),
        finalFee,
        notes: notes || null,
        userId,
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
    console.error("createMedicalRecordPatients error:", error);
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
        MedicalRecord: {
          orderBy: { recordDate: "desc" },
         
          select: {
            totalFee: true,
            discount: true,
            finalFee: true,
            notes: true,
            createdAt: true,
            recordDate: true,
           
            user: { select: { id: true, name: true } }, 
            items: {
              select: {
                fee: true,
                finalFee: true,
                discount: true,
                notes: true,
                department: { select: { id: true, name: true } },
                doctor: { select: { id: true, name: true } },
                procedure: { select: { id: true, name: true } },
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
    const { search, name } = req.query;

    const { page, limit, skip } = getPagination(req.query);

    const where = {
      MedicalRecord: { some: {} }, 
    };

    if (search) where.patientId = Number(search);
    if (name) where.name = { contains: name, mode: 'insensitive' };

    const totalPatients = await prisma.patient.count({ where });

    const patientsWithVisits = await prisma.patient.findMany({
      where,
      select: {
        id: true,
        patientId: true,
        name: true,
        guardianName: true,
        gender: true,
        age: true,
        cnicNumber: true,
        phoneNumber: true,
        MedicalRecord: {
          select: {
            id: true,
            recordDate: true,
            totalFee: true,
            discount: true,
            finalFee: true,
            notes: true,
          },
          orderBy: { recordDate: 'desc' },
        },
      },
      orderBy: { patientId: 'desc' },
      skip,
      take: limit,
    });

    const data = patientsWithVisits.map((p) => ({
      ...p,
      totalVisits: p.MedicalRecord.length,
    }));

    const pagination = buildPaginationResponse(totalPatients, page, limit, data.length);

    res.status(200).json({
      success: true,
      ...pagination,
      data,
    });
  } catch (err) {
    console.error('getMedicalRecords error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export const exportMedicalRecordsExcel = async (req, res) => {
  try {
    const { from, to } = req.query;

    const where = {};
    if (from && to) {
      where.recordDate = {
        gte: new Date(from),
        lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
      };
    }

    // ✅ Fetch medical records
    const records = await prisma.medicalRecord.findMany({
      where,
      include: {
        patient: true,
        user: true, // receptionist / creator
        items: {
          include: {
            department: true,
            doctor: true,
            procedure: true,
          },
        },
      },
      orderBy: { recordDate: "asc" },
    });

    // ✅ Flatten data for Excel
    const rows = [];

    records.forEach((record) => {
      // If record has no items, still export one row
      if (record.items.length === 0) {
        rows.push({
          Date: record.recordDate.toISOString().split("T")[0],
          PatientID: record.patient.patientId,
          PatientName: record.patient.name,
          Department: record.department?.name || "",
          Doctor: record.doctor?.name || "",
          Procedure: record.procedure?.name || "",
          Fee: Number(record.totalFee),
          Discount: Number(record.discount),
          FinalFee: Number(record.finalFee),
          CreatedBy: record.user?.name || "",
        });
      }

      // If record has items
      record.items.forEach((item) => {
        rows.push({
          Date: record.recordDate.toISOString().split("T")[0],
          PatientID: record.patient.patientId,
          PatientName: record.patient.name,
          Department: item.department?.name || "",
          Doctor: item.doctor?.name || "",
          Procedure: item.procedure?.name || "",
          Fee: Number(item.fee),
          Discount: Number(item.discount),
          FinalFee: Number(item.finalFee),
          CreatedBy: record.user?.name || "",
        });
      });
    });

    // ✅ Create Excel
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Medical Records");

    // ✅ Response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=medical-records.xlsx`
    );

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return res.send(buffer);
  } catch (error) {
    console.error("exportMedicalRecordsExcel error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

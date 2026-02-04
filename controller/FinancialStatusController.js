import prisma from "../DB/db.config.js";

/* =======================
   Date Range Helper
======================= */
function getDateRange(startDate, endDate) {
  let start;
  let end;

  if (startDate && endDate) {
    start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  } else {
    start = new Date();
    start.setHours(0, 0, 0, 0);

    end = new Date();
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
}

/* =======================
   USER FINANCIAL REPORT
======================= */
async function getUserFinancialReport({
  startDate,
  endDate,
  userId,
  departmentId,
}) {
  const { start, end } = getDateRange(startDate, endDate);

  const records = await prisma.medicalRecord.findMany({
    where: {
      recordDate: {
        gte: start,
        lte: end,
      },

      // ✅ USER FILTER
      ...(userId && {
        userId: Number(userId),
      }),

      // ✅ DEPARTMENT FILTER (via items)
      ...(departmentId && {
        items: {
          some: {
            departmentId: Number(departmentId),
          },
        },
      }),
    },

    select: {
      id: true,
      recordDate: true,
      finalFee: true,

      user: {
        select: { id: true, name: true },
      },

      patient: {
        select: { id: true, name: true },
      },

      items: {
        where: {
          ...(departmentId && {
            departmentId: Number(departmentId),
          }),
        },
        select: {
          finalFee: true,
          department: {
            select: { id: true, name: true },
          },
        },
      },
    },

    orderBy: { recordDate: "desc" },
  });

  /* =======================
     GROUP BY USER
  ======================= */
  const userMap = {};

  records.forEach((record) => {
    const uid = record.user?.id || 0;

    if (!userMap[uid]) {
      userMap[uid] = {
        userId: uid,
        userName: record.user?.name || "Unknown",
        totalRevenue: 0,
        records: [],
      };
    }

    const recordTotal = Number(record.finalFee || 0);
    userMap[uid].totalRevenue += recordTotal;

    userMap[uid].records.push({
      recordId: record.id,
      date: record.recordDate,
      patient: record.patient?.name || "Unknown",
      totalFee: recordTotal,
      departments: record.items.map((item) => ({
        departmentId: item.department?.id,
        department: item.department?.name || "Unknown",
        fee: Number(item.finalFee || 0),
      })),
    });
  });

  return Object.values(userMap);
}

/* =======================
   EXPRESS HANDLER
======================= */
export async function getFinancialReportHandler(req, res) {
  try {
    const { startDate, endDate, userId, departmentId } = req.query;

    const users = await getUserFinancialReport({
      startDate,
      endDate,
      userId,
      departmentId,
    });

    res.json({
      success: true,
      filter: {
        startDate,
        endDate,
        userId,
        departmentId,
      },
      users,
    });
  } catch (err) {
    console.error("Financial report error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch financial report",
    });
  }
}

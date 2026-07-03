import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// All routes here require an authenticated ADMIN.
router.use(requireAuth, requireRole("ADMIN"));

// GET /api/attendance/employees - approved employees for the picker.
router.get("/employees", async (_req, res) => {
  try {
    const employees = await prisma.employeeProfile.findMany({
      where: { onboardingStatus: "APPROVED" },
      include: { user: { select: { fullName: true, email: true } } },
      orderBy: { employeeCode: "asc" },
    });

    const result = employees.map((e) => ({
      id: e.id,
      employeeCode: e.employeeCode,
      fullName: e.user.fullName,
      email: e.user.email,
      jobTitle: e.jobTitle,
    }));

    res.json({ employees: result });
  } catch (err) {
    console.error("List attendance employees error:", err);
    res.status(500).json({ message: "Failed to load employees." });
  }
});

// GET /api/attendance/:employeeId?year=YYYY&month=M (month is 1-12)
// Returns the employee's attendance records for the given month plus a summary.
router.get("/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  const year = Number(req.query.year);
  const month = Number(req.query.month); // 1-12

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return res.status(400).json({ message: "Valid year and month (1-12) are required." });
  }

  try {
    const employee = await prisma.employeeProfile.findUnique({
      where: { id: employeeId },
      include: { user: { select: { fullName: true, email: true } } },
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Month range [start, nextMonthStart) in UTC.
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    const records = await prisma.attendance.findMany({
      where: { employeeId, date: { gte: start, lt: end } },
      orderBy: { date: "asc" },
    });

    // Holidays in the same window (so the calendar can mark them).
    const holidays = await prisma.holiday.findMany({
      where: { date: { gte: start, lt: end } },
    });

    // Summary counts by status.
    const summary = { PRESENT: 0, ABSENT: 0, LATE: 0, HALF_DAY: 0, ON_LEAVE: 0, HOLIDAY: 0 };
    for (const r of records) {
      if (summary[r.status] !== undefined) summary[r.status] += 1;
    }

    res.json({
      employee: {
        id: employee.id,
        employeeCode: employee.employeeCode,
        fullName: employee.user.fullName,
        email: employee.user.email,
      },
      year,
      month,
      records: records.map((r) => ({
        id: r.id,
        date: r.date,
        checkIn: r.checkIn,
        checkOut: r.checkOut,
        status: r.status,
        workedHours: r.workedHours,
        note: r.note,
      })),
      holidays: holidays.map((h) => ({ date: h.date, name: h.name })),
      summary,
    });
  } catch (err) {
    console.error("Get attendance error:", err);
    res.status(500).json({ message: "Failed to load attendance." });
  }
});

export default router;

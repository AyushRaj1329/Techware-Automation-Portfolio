import { Router } from "express";
import { z } from "zod";
import prisma from "../prismaClient.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// All routes here require an authenticated ADMIN.
router.use(requireAuth, requireRole("ADMIN"));

const holidaySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  date: z
    .string()
    .min(1, "Date is required.")
    .refine((v) => !Number.isNaN(new Date(v).getTime()), "Enter a valid date."),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  isRecurring: z.boolean().optional(),
});

// Normalizes a date string to midnight UTC for a clean @db.Date value.
function toDateOnly(v) {
  const d = new Date(v);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

// GET /api/holidays - list holidays ordered by date.
router.get("/", async (_req, res) => {
  try {
    const holidays = await prisma.holiday.findMany({ orderBy: { date: "asc" } });
    res.json({ holidays });
  } catch (err) {
    console.error("List holidays error:", err);
    res.status(500).json({ message: "Failed to load holidays." });
  }
});

// POST /api/holidays - create a holiday.
router.post("/", async (req, res) => {
  const parsed = holidaySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const d = parsed.data;
  const date = toDateOnly(d.date);

  try {
    const existing = await prisma.holiday.findUnique({ where: { date } });
    if (existing) {
      return res.status(409).json({ message: "A holiday already exists on this date." });
    }

    const holiday = await prisma.holiday.create({
      data: {
        name: d.name,
        date,
        description: d.description || null,
        isRecurring: d.isRecurring ?? false,
      },
    });
    res.status(201).json({ holiday });
  } catch (err) {
    console.error("Create holiday error:", err);
    res.status(500).json({ message: "Failed to create holiday." });
  }
});

// PUT /api/holidays/:id - update a holiday.
router.put("/:id", async (req, res) => {
  const parsed = holidaySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const d = parsed.data;
  const date = toDateOnly(d.date);
  const { id } = req.params;

  try {
    const current = await prisma.holiday.findUnique({ where: { id } });
    if (!current) {
      return res.status(404).json({ message: "Holiday not found." });
    }

    const clash = await prisma.holiday.findFirst({ where: { id: { not: id }, date } });
    if (clash) {
      return res.status(409).json({ message: "Another holiday already exists on this date." });
    }

    const holiday = await prisma.holiday.update({
      where: { id },
      data: {
        name: d.name,
        date,
        description: d.description || null,
        isRecurring: d.isRecurring ?? current.isRecurring,
      },
    });
    res.json({ holiday });
  } catch (err) {
    console.error("Update holiday error:", err);
    res.status(500).json({ message: "Failed to update holiday." });
  }
});

// DELETE /api/holidays/:id - remove a holiday.
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const current = await prisma.holiday.findUnique({ where: { id } });
    if (!current) {
      return res.status(404).json({ message: "Holiday not found." });
    }
    await prisma.holiday.delete({ where: { id } });
    res.json({ message: "Holiday deleted." });
  } catch (err) {
    console.error("Delete holiday error:", err);
    res.status(500).json({ message: "Failed to delete holiday." });
  }
});

export default router;

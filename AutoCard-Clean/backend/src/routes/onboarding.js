import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { onboardingSchema } from "../validation/onboarding.js";

const router = Router();

// All routes here require an authenticated EMPLOYEE.
router.use(requireAuth, requireRole("EMPLOYEE"));

// Normalizes optional empty strings to null and numbers from strings.
function toNull(v) {
  return v === "" || v === undefined ? null : v;
}
function toNumberOrNull(v) {
  if (v === "" || v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

// GET /api/onboarding/me - return the current employee's profile + status.
router.get("/me", async (req, res) => {
  try {
    const profile = await prisma.employeeProfile.findUnique({
      where: { userId: req.user.id },
    });
    if (!profile) {
      return res.status(404).json({ message: "Employee profile not found." });
    }
    res.json({ profile });
  } catch (err) {
    console.error("Get onboarding error:", err);
    res.status(500).json({ message: "Failed to load profile." });
  }
});

// POST /api/onboarding/submit - validate + save form, set status to SUBMITTED,
// and raise an approval request in the admin Requests module.
router.post("/submit", async (req, res) => {
  const parsed = onboardingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }

  const d = parsed.data;

  try {
    const profile = await prisma.employeeProfile.findUnique({
      where: { userId: req.user.id },
    });
    if (!profile) {
      return res.status(404).json({ message: "Employee profile not found." });
    }

    if (profile.onboardingStatus === "APPROVED") {
      return res.status(400).json({ message: "Your onboarding is already approved." });
    }
    if (profile.onboardingStatus === "SUBMITTED") {
      return res.status(400).json({ message: "Your onboarding is already submitted and pending approval." });
    }

    const profileData = {
      // Personal.
      firstName: d.firstName,
      lastName: d.lastName,
      phone: d.phone,
      alternatePhone: toNull(d.alternatePhone),
      personalEmail: toNull(d.personalEmail),
      dateOfBirth: new Date(d.dateOfBirth),
      gender: d.gender,
      maritalStatus: toNull(d.maritalStatus),
      nationality: d.nationality,
      bloodGroup: toNull(d.bloodGroup),
      // Address.
      addressLine1: d.addressLine1,
      addressLine2: toNull(d.addressLine2),
      city: d.city,
      state: d.state,
      postalCode: d.postalCode,
      country: d.country,
      // Emergency.
      emergencyContactName: d.emergencyContactName,
      emergencyContactRelation: d.emergencyContactRelation,
      emergencyContactPhone: d.emergencyContactPhone,
      // Banking.
      bankName: d.bankName,
      bankAccountName: d.bankAccountName,
      bankAccountNumber: d.bankAccountNumber,
      bankIfscCode: d.bankIfscCode,
      bankBranch: toNull(d.bankBranch),
      // Professional.
      jobTitle: d.jobTitle,
      highestQualification: d.highestQualification,
      university: toNull(d.university),
      graduationYear: toNumberOrNull(d.graduationYear),
      totalExperienceYears: toNumberOrNull(d.totalExperienceYears),
      previousemployer: toNull(d.previousEmployer),
      skills: toNull(d.skills),
      // Identification / proofs.
      nationalIdNumber: d.nationalIdNumber,
      taxIdNumber: toNull(d.taxIdNumber),
      passportNumber: toNull(d.passportNumber),
      idProofDocument: d.idProofDocument,
      addressProofDocument: toNull(d.addressProofDocument),
      educationProofDocument: toNull(d.educationProofDocument),
      resumeDocument: toNull(d.resumeDocument),
      // Status.
      onboardingStatus: "SUBMITTED",
    };

    // Update profile, flip status, and create the approval request atomically.
    const [updated] = await prisma.$transaction([
      prisma.employeeProfile.update({
        where: { id: profile.id },
        data: profileData,
      }),
      prisma.employeeRequest.create({
        data: {
          employeeId: profile.id,
          type: "ONBOARDING",
          subject: "Onboarding approval request",
          description: "Employee has completed and submitted the onboarding form.",
          status: "PENDING",
        },
      }),
    ]);

    res.json({ profile: updated });
  } catch (err) {
    console.error("Submit onboarding error:", err);
    res.status(500).json({ message: "Failed to submit onboarding." });
  }
});

export default router;

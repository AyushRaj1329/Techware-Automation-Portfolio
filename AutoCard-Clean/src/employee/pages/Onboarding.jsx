import { useEffect, useState } from "react";
import { ClipboardList, Loader2, Send, CheckCircle2, Clock, User, Landmark, Briefcase, FileText } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost } from "../../lib/api.js";
import { updateAuthUser } from "../../lib/auth.js";

const emptyForm = {
  // Personal
  firstName: "", lastName: "", phone: "", alternatePhone: "", personalEmail: "",
  dateOfBirth: "", gender: "", maritalStatus: "", nationality: "", bloodGroup: "",
  addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "",
  emergencyContactName: "", emergencyContactRelation: "", emergencyContactPhone: "",
  // Banking
  bankName: "", bankAccountName: "", bankAccountNumber: "", bankIfscCode: "", bankBranch: "",
  // Professional
  jobTitle: "", highestQualification: "", university: "", graduationYear: "",
  totalExperienceYears: "", previousEmployer: "", skills: "",
  // Proofs
  nationalIdNumber: "", taxIdNumber: "", passportNumber: "",
  idProofDocument: "", addressProofDocument: "", educationProofDocument: "", resumeDocument: "",
};

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

const currentYear = new Date().getFullYear();
// Latest DOB allowing 18 years of age.
const maxDob = new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000).toISOString().slice(0, 10);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <Icon className="h-4.5 w-4.5 text-primary" />
    </div>
    <div>
      <h2 className="font-display font-semibold">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
);

// Labeled field wrapper. `required` adds a red asterisk.
const Field = ({ label, required, children, full }) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <label className="text-sm font-medium mb-1.5 block">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {children}
  </div>
);

const Onboarding = () => {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const loadProfile = async () => {
    try {
      const data = await apiGet("/onboarding/me");
      const p = data.profile;
      setStatus(p.onboardingStatus);
      // Hydrate any previously-entered values.
      setForm((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.keys(emptyForm).map((k) => {
            if (k === "dateOfBirth") return [k, p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : ""];
            if (k === "previousEmployer") return [k, p.previousemployer ?? ""];
            const val = p[k];
            return [k, val === null || val === undefined ? "" : String(val)];
          })
        ),
      }));
    } catch (err) {
      toast.error(err.message || "Failed to load onboarding.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadProfile();
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const data = await apiPost("/onboarding/submit", form);
      setStatus(data.profile.onboardingStatus);
      updateAuthUser({ onboardingStatus: data.profile.onboardingStatus });
      toast.success("Onboarding submitted. Awaiting admin approval.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err.message || "Failed to submit onboarding.");
    } finally {
      setSubmitting(false);
    }
  };

  const header = (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <ClipboardList className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="font-display text-2xl font-bold">Onboarding Form</h1>
        <p className="text-sm text-muted-foreground">Complete all required details to request access.</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-8">
        {header}
        <div className="p-12 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
        </div>
      </div>
    );
  }

  if (status === "SUBMITTED") {
    return (
      <div className="space-y-8">
        {header}
        <div className="rounded-2xl border border-border bg-background p-12 flex flex-col items-center text-center card-shadow">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Clock className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="font-display text-lg font-semibold mb-1">Awaiting Approval</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Your onboarding form has been submitted and is pending admin approval. Once approved, you'll get access to attendance and leave modules.
          </p>
        </div>
      </div>
    );
  }

  if (status === "APPROVED") {
    return (
      <div className="space-y-8">
        {header}
        <div className="rounded-2xl border border-border bg-background p-12 flex flex-col items-center text-center card-shadow">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <h2 className="font-display text-lg font-semibold mb-1">Onboarding Approved</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Your onboarding is complete and approved. You now have full access to all employee modules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {header}

      {status === "REJECTED" && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Your previous submission was rejected. Please review your details and resubmit.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal details */}
        <div className="rounded-2xl bg-background border border-border card-shadow p-6">
          <SectionHeader icon={User} title="Personal Details" subtitle="Your basic identity and contact information" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="First Name" required>
              <input className={inputClass} value={form.firstName} onChange={set("firstName")} maxLength={60} placeholder="Jane" required />
            </Field>
            <Field label="Last Name" required>
              <input className={inputClass} value={form.lastName} onChange={set("lastName")} maxLength={60} placeholder="Doe" required />
            </Field>
            <Field label="Phone" required>
              <input type="tel" className={inputClass} value={form.phone} onChange={set("phone")} pattern="[+]?[\d\s()\-]{7,20}" title="7-20 digits, may include + ( ) -" placeholder="+1 555 123 4567" required />
            </Field>
            <Field label="Alternate Phone">
              <input type="tel" className={inputClass} value={form.alternatePhone} onChange={set("alternatePhone")} pattern="[+]?[\d\s()\-]{7,20}" title="7-20 digits, may include + ( ) -" placeholder="Optional" />
            </Field>
            <Field label="Personal Email">
              <input type="email" className={inputClass} value={form.personalEmail} onChange={set("personalEmail")} placeholder="jane@example.com" />
            </Field>
            <Field label="Date of Birth" required>
              <input type="date" className={inputClass} value={form.dateOfBirth} onChange={set("dateOfBirth")} max={maxDob} min="1925-01-01" required />
            </Field>
            <Field label="Gender" required>
              <select className={inputClass} value={form.gender} onChange={set("gender")} required>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Marital Status">
              <select className={inputClass} value={form.maritalStatus} onChange={set("maritalStatus")}>
                <option value="">Select...</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Nationality" required>
              <input className={inputClass} value={form.nationality} onChange={set("nationality")} maxLength={60} placeholder="e.g. American" required />
            </Field>
            <Field label="Blood Group">
              <select className={inputClass} value={form.bloodGroup} onChange={set("bloodGroup")}>
                <option value="">Select...</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="border-t border-border my-6" />
          <h3 className="text-sm font-semibold mb-4">Address</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Address Line 1" required full>
              <input className={inputClass} value={form.addressLine1} onChange={set("addressLine1")} maxLength={200} placeholder="Street address" required />
            </Field>
            <Field label="Address Line 2" full>
              <input className={inputClass} value={form.addressLine2} onChange={set("addressLine2")} maxLength={200} placeholder="Apartment, suite, etc. (optional)" />
            </Field>
            <Field label="City" required>
              <input className={inputClass} value={form.city} onChange={set("city")} maxLength={80} placeholder="City" required />
            </Field>
            <Field label="State / Province" required>
              <input className={inputClass} value={form.state} onChange={set("state")} maxLength={80} placeholder="State" required />
            </Field>
            <Field label="Postal Code" required>
              <input className={inputClass} value={form.postalCode} onChange={set("postalCode")} pattern="[A-Za-z0-9\s\-]{3,12}" title="3-12 letters, digits, spaces or hyphens" placeholder="ZIP / Postal code" required />
            </Field>
            <Field label="Country" required>
              <input className={inputClass} value={form.country} onChange={set("country")} maxLength={80} placeholder="Country" required />
            </Field>
          </div>

          <div className="border-t border-border my-6" />
          <h3 className="text-sm font-semibold mb-4">Emergency Contact</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Contact Name" required>
              <input className={inputClass} value={form.emergencyContactName} onChange={set("emergencyContactName")} maxLength={120} placeholder="Full name" required />
            </Field>
            <Field label="Relationship" required>
              <input className={inputClass} value={form.emergencyContactRelation} onChange={set("emergencyContactRelation")} maxLength={60} placeholder="e.g. Spouse, Parent" required />
            </Field>
            <Field label="Contact Phone" required>
              <input type="tel" className={inputClass} value={form.emergencyContactPhone} onChange={set("emergencyContactPhone")} pattern="[+]?[\d\s()\-]{7,20}" title="7-20 digits, may include + ( ) -" placeholder="+1 555 987 6543" required />
            </Field>
          </div>
        </div>

        {/* Banking details */}
        <div className="rounded-2xl bg-background border border-border card-shadow p-6">
          <SectionHeader icon={Landmark} title="Banking Details" subtitle="Used for salary disbursement" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Bank Name" required>
              <input className={inputClass} value={form.bankName} onChange={set("bankName")} maxLength={120} placeholder="Bank name" required />
            </Field>
            <Field label="Account Holder Name" required>
              <input className={inputClass} value={form.bankAccountName} onChange={set("bankAccountName")} maxLength={120} placeholder="As per bank records" required />
            </Field>
            <Field label="Account Number" required>
              <input className={inputClass} value={form.bankAccountNumber} onChange={set("bankAccountNumber")} inputMode="numeric" pattern="\d{6,20}" title="6-20 digits" placeholder="Account number" required />
            </Field>
            <Field label="IFSC / Routing Code" required>
              <input className={inputClass} value={form.bankIfscCode} onChange={(e) => setForm((p) => ({ ...p, bankIfscCode: e.target.value.toUpperCase() }))} pattern="[A-Za-z0-9\-]{4,20}" title="4-20 letters, digits or hyphens" placeholder="e.g. ABCD0123456" required />
            </Field>
            <Field label="Branch">
              <input className={inputClass} value={form.bankBranch} onChange={set("bankBranch")} maxLength={120} placeholder="Branch name (optional)" />
            </Field>
          </div>
        </div>

        {/* Professional details */}
        <div className="rounded-2xl bg-background border border-border card-shadow p-6">
          <SectionHeader icon={Briefcase} title="Professional Details" subtitle="Your qualifications and experience" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Job Title" required>
              <input className={inputClass} value={form.jobTitle} onChange={set("jobTitle")} maxLength={120} placeholder="e.g. Automation Engineer" required />
            </Field>
            <Field label="Highest Qualification" required>
              <input className={inputClass} value={form.highestQualification} onChange={set("highestQualification")} maxLength={120} placeholder="e.g. B.Sc Computer Science" required />
            </Field>
            <Field label="University / Institution">
              <input className={inputClass} value={form.university} onChange={set("university")} maxLength={200} placeholder="Optional" />
            </Field>
            <Field label="Graduation Year">
              <input type="number" className={inputClass} value={form.graduationYear} onChange={set("graduationYear")} min={1950} max={currentYear} placeholder={`1950 - ${currentYear}`} />
            </Field>
            <Field label="Total Experience (years)">
              <input type="number" step="0.5" className={inputClass} value={form.totalExperienceYears} onChange={set("totalExperienceYears")} min={0} max={60} placeholder="e.g. 3.5" />
            </Field>
            <Field label="Previous Employer">
              <input className={inputClass} value={form.previousEmployer} onChange={set("previousEmployer")} maxLength={200} placeholder="Optional" />
            </Field>
            <Field label="Skills" full>
              <textarea className={inputClass + " resize-none"} rows={2} value={form.skills} onChange={set("skills")} maxLength={500} placeholder="Comma-separated skills (optional)" />
            </Field>
          </div>
        </div>

        {/* Proofs / identification */}
        <div className="rounded-2xl bg-background border border-border card-shadow p-6">
          <SectionHeader icon={FileText} title="Proofs & Identification" subtitle="Identity and document references" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="National ID Number" required>
              <input className={inputClass} value={form.nationalIdNumber} onChange={set("nationalIdNumber")} minLength={4} maxLength={40} placeholder="Government ID number" required />
            </Field>
            <Field label="Tax ID Number">
              <input className={inputClass} value={form.taxIdNumber} onChange={set("taxIdNumber")} maxLength={40} placeholder="Optional" />
            </Field>
            <Field label="Passport Number">
              <input className={inputClass} value={form.passportNumber} onChange={set("passportNumber")} maxLength={40} placeholder="Optional" />
            </Field>
            <div className="hidden sm:block" />
            <Field label="ID Proof Document" required full>
              <input className={inputClass} value={form.idProofDocument} onChange={set("idProofDocument")} maxLength={300} placeholder="Document name or link (e.g. passport_scan.pdf)" required />
            </Field>
            <Field label="Address Proof Document">
              <input className={inputClass} value={form.addressProofDocument} onChange={set("addressProofDocument")} maxLength={300} placeholder="Optional" />
            </Field>
            <Field label="Education Proof Document">
              <input className={inputClass} value={form.educationProofDocument} onChange={set("educationProofDocument")} maxLength={300} placeholder="Optional" />
            </Field>
            <Field label="Resume / CV" full>
              <input className={inputClass} value={form.resumeDocument} onChange={set("resumeDocument")} maxLength={300} placeholder="Document name or link (optional)" />
            </Field>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Note: document fields currently accept a file name or link reference. File uploads can be added later.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 pb-4">
          <p className="text-xs text-muted-foreground">Fields marked <span className="text-destructive">*</span> are required.</p>
          <button
            type="submit"
            disabled={submitting}
            className="cta-gradient text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding;

import { useEffect, useState } from "react";
import { X, Loader2, User, Landmark, Briefcase, FileText, Check } from "lucide-react";
import { toast } from "sonner";
import { apiGet } from "../../lib/api.js";

// Read-only field display.
const Item = ({ label, value }) => (
  <div>
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="text-sm font-medium mt-0.5 break-words">{value || "—"}</div>
  </div>
);

const Section = ({ icon: Icon, title, children }) => (
  <div className="rounded-xl border border-border p-5">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h3 className="font-display font-semibold text-sm">{title}</h3>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">{children}</div>
  </div>
);

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString() : "—");

// Modal that fetches and displays the full submitted onboarding profile for a
// given request, with Approve/Reject actions in the footer.
const OnboardingPreview = ({ requestId, onClose, onApprove, onReject, acting }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await apiGet(`/requests/${requestId}/profile`);
      setProfile(data.profile);
    } catch (err) {
      toast.error(err.message || "Failed to load profile.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const fullName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.user?.fullName
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-foreground/50" onClick={onClose} />
      <div className="relative bg-background rounded-2xl border border-border shadow-xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-background rounded-t-2xl">
          <div>
            <h2 className="font-display text-lg font-bold">Onboarding Submission</h2>
            <p className="text-sm text-muted-foreground">Review details before approving</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="p-12 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <Section icon={User} title="Personal Details">
              <Item label="Full Name" value={fullName} />
              <Item label="Employee Code" value={profile.employeeCode} />
              <Item label="Login Email" value={profile.user?.email} />
              <Item label="Personal Email" value={profile.personalEmail} />
              <Item label="Phone" value={profile.phone} />
              <Item label="Alternate Phone" value={profile.alternatePhone} />
              <Item label="Date of Birth" value={fmtDate(profile.dateOfBirth)} />
              <Item label="Gender" value={profile.gender} />
              <Item label="Marital Status" value={profile.maritalStatus} />
              <Item label="Nationality" value={profile.nationality} />
              <Item label="Blood Group" value={profile.bloodGroup} />
              <Item
                label="Address"
                value={[profile.addressLine1, profile.addressLine2, profile.city, profile.state, profile.postalCode, profile.country].filter(Boolean).join(", ")}
              />
              <Item label="Emergency Contact" value={profile.emergencyContactName} />
              <Item label="Relationship" value={profile.emergencyContactRelation} />
              <Item label="Emergency Phone" value={profile.emergencyContactPhone} />
            </Section>

            <Section icon={Landmark} title="Banking Details">
              <Item label="Bank Name" value={profile.bankName} />
              <Item label="Account Holder" value={profile.bankAccountName} />
              <Item label="Account Number" value={profile.bankAccountNumber} />
              <Item label="IFSC / Routing" value={profile.bankIfscCode} />
              <Item label="Branch" value={profile.bankBranch} />
            </Section>

            <Section icon={Briefcase} title="Professional Details">
              <Item label="Job Title" value={profile.jobTitle} />
              <Item label="Highest Qualification" value={profile.highestQualification} />
              <Item label="University" value={profile.university} />
              <Item label="Graduation Year" value={profile.graduationYear} />
              <Item label="Total Experience" value={profile.totalExperienceYears != null ? `${profile.totalExperienceYears} yrs` : null} />
              <Item label="Previous Employer" value={profile.previousemployer} />
              <Item label="Skills" value={profile.skills} />
            </Section>

            <Section icon={FileText} title="Proofs & Identification">
              <Item label="National ID" value={profile.nationalIdNumber} />
              <Item label="Tax ID" value={profile.taxIdNumber} />
              <Item label="Passport Number" value={profile.passportNumber} />
              <Item label="ID Proof Document" value={profile.idProofDocument} />
              <Item label="Address Proof" value={profile.addressProofDocument} />
              <Item label="Education Proof" value={profile.educationProofDocument} />
              <Item label="Resume / CV" value={profile.resumeDocument} />
            </Section>
          </div>
        )}

        {/* Footer actions */}
        {!loading && (
          <div className="flex items-center justify-end gap-2 p-5 border-t border-border sticky bottom-0 bg-background rounded-b-2xl">
            <button
              onClick={onReject}
              disabled={acting}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-60"
            >
              Reject
            </button>
            <button
              onClick={onApprove}
              disabled={acting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60"
            >
              {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPreview;

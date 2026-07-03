import { useEffect, useState } from "react";
import { CalendarDays, Loader2, RefreshCw, Plus, Pencil, Trash2, AlertTriangle, X, CalendarCheck, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut, apiDelete } from "../../lib/api.js";

const emptyForm = {
  name: "",
  date: "",
  description: "",
  isRecurring: false,
};

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

// Formats a date string as a readable, locale-aware date.
const fmt = (v) =>
  v ? new Date(v).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

const StatCard = ({ icon: Icon, label, value, tone }) => {
  const tones = {
    primary: "bg-primary/10 text-primary",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <div className="rounded-2xl bg-background border border-border card-shadow p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon className="h-5.5 w-5.5" />
      </div>
      <div>
        <div className="font-display text-2xl font-bold leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
};

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const data = await apiGet("/holidays");
      setHolidays(data.holidays);
    } catch (err) {
      toast.error(err.message || "Failed to load holidays.");
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setLoading(true);
    load();
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (h) => {
    setEditingId(h.id);
    setForm({
      name: h.name,
      date: h.date ? h.date.slice(0, 10) : "",
      description: h.description || "",
      isRecurring: h.isRecurring,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const payload = {
      name: form.name,
      date: form.date,
      description: form.description || undefined,
      isRecurring: form.isRecurring,
    };
    try {
      if (editingId) {
        await apiPut(`/holidays/${editingId}`, payload);
        toast.success("Holiday updated.");
      } else {
        await apiPost("/holidays", payload);
        toast.success("Holiday added.");
      }
      resetForm();
      refresh();
    } catch (err) {
      toast.error(err.message || "Failed to save holiday.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/holidays/${deleteTarget.id}`);
      toast.success(`"${deleteTarget.name}" deleted.`);
      if (editingId === deleteTarget.id) resetForm();
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      toast.error(err.message || "Failed to delete holiday.");
    } finally {
      setDeleting(false);
    }
  };

  const now = new Date();
  const upcoming = holidays.filter((h) => new Date(h.date) >= new Date(now.toDateString())).length;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <CalendarDays className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Holidays</h1>
          <p className="text-sm text-muted-foreground">Manage the company holiday calendar.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={CalendarDays} label="Total Holidays" value={holidays.length} tone="primary" />
        <StatCard icon={CalendarClock} label="Upcoming" value={upcoming} tone="blue" />
        <StatCard icon={CalendarCheck} label="Recurring" value={holidays.filter((h) => h.isRecurring).length} tone="amber" />
      </div>

      {/* Create / edit form */}
      <div className="rounded-2xl bg-background border border-border card-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">{editingId ? "Edit Holiday" : "Add Holiday"}</h2>
          {editingId && (
            <button onClick={resetForm} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <X className="h-4 w-4" /> Cancel edit
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Holiday Name <span className="text-destructive">*</span></label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} maxLength={120} placeholder="e.g. New Year's Day" required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Date <span className="text-destructive">*</span></label>
            <input type="date" className={inputClass} value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <input className={inputClass} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} maxLength={300} placeholder="Optional notes (optional)" />
          </div>
          <div className="sm:col-span-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input type="checkbox" className="rounded border-border" checked={form.isRecurring} onChange={(e) => setForm((p) => ({ ...p, isRecurring: e.target.checked }))} />
              Recurring every year
            </label>
            <button type="submit" disabled={saving} className="cta-gradient text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {saving ? "Saving..." : editingId ? "Update Holiday" : "Add Holiday"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="rounded-2xl bg-background border border-border card-shadow overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-lg font-semibold">Holiday Calendar</h2>
          <button onClick={refresh} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
          </div>
        ) : holidays.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No holidays yet. Add one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Recurring</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h) => (
                  <tr key={h.id} className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors">
                    <td className="px-6 py-3 font-medium whitespace-nowrap">{fmt(h.date)}</td>
                    <td className="px-6 py-3">{h.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{h.description || "—"}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${h.isRecurring ? "bg-amber-100 text-amber-700" : "bg-secondary text-muted-foreground"}`}>
                        {h.isRecurring ? "Yearly" : "One-time"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right whitespace-nowrap">
                      <button onClick={() => startEdit(h)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(h)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => !deleting && setDeleteTarget(null)} />
          <div className="relative bg-background rounded-2xl border border-border shadow-xl w-full max-w-md p-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5.5 w-5.5 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold">Delete Holiday</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget.name}</span> ({fmt(deleteTarget.date)})? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-60">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Holidays;

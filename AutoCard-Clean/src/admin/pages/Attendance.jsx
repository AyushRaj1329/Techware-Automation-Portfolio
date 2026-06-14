import { useEffect, useState } from "react";
import { Clock, Loader2, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { toast } from "sonner";
import { apiGet } from "../../lib/api.js";

// Visual styling per attendance status.
const statusMeta = {
  PRESENT: { label: "Present", dot: "bg-emerald-500", cell: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  ABSENT: { label: "Absent", dot: "bg-rose-500", cell: "bg-rose-50 border-rose-200 text-rose-700" },
  LATE: { label: "Late", dot: "bg-amber-500", cell: "bg-amber-50 border-amber-200 text-amber-700" },
  HALF_DAY: { label: "Half Day", dot: "bg-orange-500", cell: "bg-orange-50 border-orange-200 text-orange-700" },
  ON_LEAVE: { label: "On Leave", dot: "bg-violet-500", cell: "bg-violet-50 border-violet-200 text-violet-700" },
  HOLIDAY: { label: "Holiday", dot: "bg-blue-500", cell: "bg-blue-50 border-blue-200 text-blue-700" },
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const fmtTime = (v) =>
  v ? new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null;

const Attendance = () => {
  const today = new Date();
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-12
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const loadEmployees = async () => {
    try {
      const res = await apiGet("/attendance/employees");
      setEmployees(res.employees);
    } catch (err) {
      toast.error(err.message || "Failed to load employees.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadEmployees();
    })();
  }, []);

  // Fetch attendance whenever the selected employee or month changes.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!selectedId) {
        setData(null);
        return;
      }
      setLoadingData(true);
      try {
        const res = await apiGet(`/attendance/${selectedId}?year=${year}&month=${month}`);
        if (active) setData(res);
      } catch (err) {
        if (active) {
          toast.error(err.message || "Failed to load attendance.");
          setData(null);
        }
      } finally {
        if (active) setLoadingData(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedId, year, month]);

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  };

  // Build a map of day-of-month -> record for quick lookup.
  const recordByDay = {};
  if (data) {
    for (const r of data.records) {
      const d = new Date(r.date);
      recordByDay[d.getUTCDate()] = r;
    }
  }
  const holidayByDay = {};
  if (data) {
    for (const h of data.holidays) {
      const d = new Date(h.date);
      holidayByDay[d.getUTCDate()] = h.name;
    }
  }

  // Calendar grid cells: leading blanks + days of month.
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const summary = data?.summary || {};

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Attendance</h1>
          <p className="text-sm text-muted-foreground">View employee attendance logs in a calendar.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-2xl bg-background border border-border card-shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">Select Employee</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={loadingEmployees}
            >
              <option value="">{loadingEmployees ? "Loading employees..." : "Choose an employee..."}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.employeeCode})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="min-w-[160px] text-center font-display font-semibold">
              {monthNames[month - 1]} {year}
            </div>
            <button
              onClick={() => changeMonth(1)}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {!selectedId ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Users className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="font-display text-lg font-semibold mb-1">Select an employee</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Choose an employee above to view their attendance calendar for the selected month.
          </p>
        </div>
      ) : loadingData ? (
        <div className="p-12 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading attendance...
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(statusMeta).map(([key, meta]) => (
              <div key={key} className="rounded-xl bg-background border border-border card-shadow p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
                  <span className="text-xs text-muted-foreground">{meta.label}</span>
                </div>
                <div className="font-display text-xl font-bold">{summary[key] || 0}</div>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className="rounded-2xl bg-background border border-border card-shadow p-6">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekdays.map((w) => (
                <div key={w} className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground py-1">
                  {w}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {cells.map((day, idx) => {
                if (day === null) return <div key={`blank-${idx}`} className="aspect-square" />;

                const rec = recordByDay[day];
                const holidayName = holidayByDay[day];
                const meta = rec ? statusMeta[rec.status] : holidayName ? statusMeta.HOLIDAY : null;
                const isToday =
                  day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();

                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg border p-1.5 flex flex-col ${
                      meta ? meta.cell : "bg-background border-border"
                    } ${isToday ? "ring-2 ring-primary" : ""}`}
                    title={
                      rec
                        ? `${statusMeta[rec.status]?.label}${rec.checkIn ? ` · In ${fmtTime(rec.checkIn)}` : ""}${rec.checkOut ? ` · Out ${fmtTime(rec.checkOut)}` : ""}`
                        : holidayName || ""
                    }
                  >
                    <div className="text-xs font-semibold">{day}</div>
                    {rec ? (
                      <div className="mt-auto text-[10px] leading-tight">
                        {fmtTime(rec.checkIn) && <div className="truncate">In {fmtTime(rec.checkIn)}</div>}
                        {rec.workedHours != null && <div className="truncate opacity-75">{rec.workedHours}h</div>}
                      </div>
                    ) : holidayName ? (
                      <div className="mt-auto text-[10px] leading-tight truncate">{holidayName}</div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4">
            {Object.entries(statusMeta).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`w-3 h-3 rounded-full ${meta.dot}`} />
                {meta.label}
              </div>
            ))}
          </div>

          {data && data.records.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No attendance records for {monthNames[month - 1]} {year}.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Attendance;

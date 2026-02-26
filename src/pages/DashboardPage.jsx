import { SPOTS, BATCH_SCHEDULE, DAY_NAMES } from "../data";
import { useBooking } from "../context/BookingContext";
import { isWorkingDay, getWeekParity, batchColor, batchBg, formatDate, dateStr } from "../utils";

const StatCard = ({ icon, value, label, color }) => (
  <div className="stat-card">
    <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
    <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{label}</div>
  </div>
);

const BatchScheduleCard = ({ batch, selectedDate }) => {
  const week = getWeekParity(selectedDate);
  const schedule = BATCH_SCHEDULE[batch];
  const workDays = week === 1 ? schedule.week1 : schedule.week2;
  const jsDay = new Date(selectedDate).getDay();
  const isActive = isWorkingDay(batch, selectedDate);

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: batchColor(batch) }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Batch {batch}</span>
        </div>
        <span className="badge" style={{
          background: isActive ? "rgba(16,185,129,0.15)" : "rgba(100,116,139,0.15)",
          color: isActive ? "#10b981" : "#64748b",
        }}>
          {isActive ? "● Working Today" : "○ Off Today"}
        </span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>Week {week} Schedule</div>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5].map((d) => {
            const isWork    = workDays.includes(d);
            const isCurrent = d === jsDay;
            return (
              <div key={d} style={{
                flex: 1, padding: "6px 4px", borderRadius: 8,
                textAlign: "center",
                background: isCurrent ? batchColor(batch) : isWork ? batchBg(batch) : "#0f172a",
                border: `1px solid ${isCurrent ? batchColor(batch) : isWork ? "rgba(59,130,246,0.2)" : "#1e293b"}`,
                fontSize: 11, fontWeight: 600,
                color: isCurrent ? "#fff" : isWork ? batchColor(batch) : "#475569",
              }}>
                {DAY_NAMES[d].slice(0, 3)}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b" }}>
        <span>5 Spots · 40 Members</span>
        <span>Spots {batch === 1 ? "A–E" : "F–J"}</span>
      </div>
    </div>
  );
};

const DashboardPage = ({ selectedDate }) => {
  const { getFloaterSeats } = useBooking();
  const floaters = getFloaterSeats(selectedDate);

  const stats = [
    { icon: "🪑", value: 50,  label: "Total Seats",      color: "#3b82f6" },
    { icon: "🔓", value: 10,  label: "Buffer Seats",     color: "#10b981" },
    { icon: "👥", value: 40,  label: "Batch 1 Members",  color: "#3b82f6" },
    { icon: "👥", value: 40,  label: "Batch 2 Members",  color: "#8b5cf6" },
  ];

  return (
    <div className="fade-in">
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Batch schedule cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <BatchScheduleCard batch={1} selectedDate={selectedDate} />
        <BatchScheduleCard batch={2} selectedDate={selectedDate} />
      </div>

      {/* Floater seats panel */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700 }}>Floater Seats — {formatDate(selectedDate)}</h3>
          <span className="badge" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
            {floaters.length} Available
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          {floaters.slice(0, 12).map((f) => (
            <div key={f.key} style={{
              background: "#0f172a", border: "1px solid #1e293b",
              borderRadius: 10, padding: "10px 14px", fontSize: 13,
            }}>
              <div style={{ fontSize: 10, color: f.type === "buffer" ? "#10b981" : "#f59e0b", fontWeight: 700, marginBottom: 4 }}>
                {f.type === "buffer" ? "BUFFER" : "RELEASED"}
              </div>
              <div style={{ color: "#e2e8f0" }}>{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

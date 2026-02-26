import { useEffect, useState } from "react";
import { apiGetBookingsByDate, apiGetFloaterSeats } from "../api";
import { formatDate, dateStr, batchColor, batchBg } from "../utils";

const StatCard = ({ icon, value, label, color }) => (
  <div className="stat-card">
    <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
    <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{label}</div>
  </div>
);

const DashboardPage = ({ selectedDate }) => {
  const [bookings, setBookings]     = useState([]);
  const [floaters, setFloaters]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const ds = dateStr(selectedDate);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiGetBookingsByDate(ds),
      apiGetFloaterSeats(ds),
    ]).then(([bRes, fRes]) => {
      setBookings(bRes.bookings || []);
      setFloaters(fRes.floaterSeats || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [ds]);

  const batch1Bookings = bookings.filter((b) => b.member?.batch === 1).length;
  const batch2Bookings = bookings.filter((b) => b.member?.batch === 2).length;

  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="🪑" value={50}  label="Total Seats"      color="#3b82f6" />
        <StatCard icon="🔓" value={10}  label="Buffer Seats"     color="#10b981" />
        <StatCard icon="📋" value={bookings.length} label={`Bookings on ${formatDate(selectedDate)}`} color="#f59e0b" />
        <StatCard icon="🪑" value={floaters.length} label="Floater Seats Available" color="#8b5cf6" />
      </div>

      {/* Batch breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {[1, 2].map((batch) => {
          const count = batch === 1 ? batch1Bookings : batch2Bookings;
          return (
            <div key={batch} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: batchColor(batch) }} />
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Batch {batch}</span>
                </div>
                <span style={{ fontSize: 13, color: "#475569" }}>Spots {batch === 1 ? "A–E" : "F–J"}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: batchColor(batch), fontFamily: "'Space Grotesk', sans-serif" }}>{count}</div>
              <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>seats booked today</div>
              <div style={{ marginTop: 12, background: "#0f172a", borderRadius: 6, height: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(count / 40) * 100}%`, background: batchColor(batch), borderRadius: 6, transition: "width 0.5s" }} />
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>{count} / 40 members</div>
            </div>
          );
        })}
      </div>

      {/* Floater seats */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700 }}>Floater Seats — {formatDate(selectedDate)}</h3>
          <span className="badge" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
            {floaters.length} Available
          </span>
        </div>
        {loading ? (
          <div style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: 20 }}>Loading…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {floaters.map((f, i) => (
              <div key={f._id || i} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: f.sourceType === "buffer" ? "#10b981" : "#f59e0b", fontWeight: 700, marginBottom: 4 }}>
                  {f.sourceType === "buffer" ? "BUFFER" : "RELEASED"}
                </div>
                <div style={{ color: "#e2e8f0", fontSize: 13 }}>{f.label}</div>
              </div>
            ))}
            {floaters.length === 0 && (
              <div style={{ color: "#475569", fontSize: 13, gridColumn: "1/-1", textAlign: "center", padding: 16 }}>No floater seats available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

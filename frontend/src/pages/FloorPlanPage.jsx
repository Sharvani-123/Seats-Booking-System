import { useEffect, useState } from "react";
import { apiGetFloorPlan } from "../api";
import { formatDate, dateStr, batchColor, batchBg } from "../utils";

const SEAT_COLORS = {
  available:       { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)", text: "#10b981" },
  booked:          { bg: "rgba(59,130,246,0.2)",  border: "#3b82f6",              text: "#93c5fd" },
  floater:         { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.4)", text: "#f59e0b" },
  "floater-booked":{ bg: "rgba(239,68,68,0.15)",  border: "#ef4444",              text: "#fca5a5" },
};

const LEGEND = [
  { color: "#10b981", label: "Available" },
  { color: "#3b82f6", label: "Booked" },
  { color: "#f59e0b", label: "Floater (Free)" },
  { color: "#ef4444", label: "Floater (Taken)" },
];

const FloorPlanPage = ({ selectedDate }) => {
  const [floorPlan, setFloorPlan] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);
  const ds = dateStr(selectedDate);

  useEffect(() => {
    setLoading(true);
    apiGetFloorPlan(ds)
      .then((res) => setFloorPlan(res.floorPlan || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ds]);

  if (loading) return <div style={{ color: "#475569", padding: 40, textAlign: "center" }}>Loading floor plan…</div>;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Floor Plan — {formatDate(selectedDate)}</h2>
        <div style={{ display: "flex", gap: 12, marginLeft: "auto", flexWrap: "wrap" }}>
          {LEGEND.map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />{label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {floorPlan.map((spot) => (
          <div key={spot.spotId} className="card" style={{ padding: 20, cursor: "pointer", border: expanded === spot.spotId ? "1px solid #3b82f6" : undefined }}
            onClick={() => setExpanded(expanded === spot.spotId ? null : spot.spotId)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: batchBg(spot.batch), border: `1px solid ${batchColor(spot.batch)}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: batchColor(spot.batch) }}>
                  {spot.name.split(" ")[1]}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{spot.name}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>Batch {spot.batch} · 8 seats</div>
                </div>
              </div>
              <span className="badge" style={{ background: spot.working ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)", color: spot.working ? "#10b981" : "#64748b" }}>
                {spot.working ? "Active" : "Off"}
              </span>
            </div>

            {/* Seat grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {spot.seats.map((seat) => {
                const c = SEAT_COLORS[seat.status] || SEAT_COLORS.available;
                return (
                  <div key={seat.seatNumber} className="seat-cell" title={seat.bookedBy?.name || seat.seatLabel}
                    style={{ background: c.bg, borderColor: c.border, color: c.text }}>
                    S{seat.seatNumber}
                  </div>
                );
              })}
            </div>

            {/* Expanded: who booked each seat */}
            {expanded === spot.spotId && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1e293b" }}>
                <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>Seat Details</div>
                {spot.seats.map((seat) => (
                  <div key={seat.seatNumber} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "4px 0" }}>
                    <span style={{ color: "#94a3b8" }}>{seat.seatLabel}</span>
                    {seat.bookedBy
                      ? <span className="badge" style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", fontSize: 10 }}>{seat.bookedBy.name}</span>
                      : <span className="badge" style={{ background: "#0f172a", color: "#475569", fontSize: 10 }}>{seat.status === "floater" ? "Floater" : "Free"}</span>
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorPlanPage;

import { useState } from "react";
import { MEMBERS } from "../../data";
import { useBooking } from "../../context/BookingContext";
import { isWorkingDay, batchColor, batchBg, dateStr } from "../../utils";

const SEAT_COLORS = {
  available:      { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)", text: "#10b981" },
  booked:         { bg: "rgba(59,130,246,0.2)",  border: "#3b82f6",              text: "#93c5fd" },
  floater:        { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.4)", text: "#f59e0b" },
  "floater-booked":{ bg: "rgba(239,68,68,0.15)", border: "#ef4444",              text: "#fca5a5" },
};

const SpotCard = ({ spot, date, expandable = true }) => {
  const [expanded, setExpanded] = useState(false);
  const { getSeatStatus, bookings } = useBooking();
  const isWorking = isWorkingDay(spot.batch, date);
  const ds = dateStr(date);
  const spotMembers = MEMBERS.filter((m) => m.spotId === spot.id);

  return (
    <div
      className="card"
      style={{
        padding: 20,
        cursor: expandable ? "pointer" : "default",
        border: expanded ? "1px solid #3b82f6" : undefined,
        transition: "border-color 0.2s",
      }}
      onClick={() => expandable && setExpanded((p) => !p)}
    >
      {/* Card header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: batchBg(spot.batch),
            border: `1px solid ${batchColor(spot.batch)}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: batchColor(spot.batch),
          }}>
            {spot.name.split(" ")[1]}
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{spot.name}</div>
            <div style={{ fontSize: 11, color: "#475569" }}>Batch {spot.batch} · 8 seats</div>
          </div>
        </div>
        <span className="badge" style={{
          background: isWorking ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)",
          color: isWorking ? "#10b981" : "#64748b",
        }}>
          {isWorking ? "Active" : "Off"}
        </span>
      </div>

      {/* Seat grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {Array.from({ length: 8 }, (_, i) => i + 1).map((seatNum) => {
          const member = spotMembers.find((m) => m.seatNum === seatNum);
          const status = getSeatStatus(spot.id, seatNum, date, member);
          const c = SEAT_COLORS[status];
          return (
            <div
              key={seatNum}
              className="seat-cell"
              title={member?.name}
              style={{ background: c.bg, borderColor: c.border, color: c.text }}
            >
              S{seatNum}
            </div>
          );
        })}
      </div>

      {/* Expanded: member list */}
      {expandable && expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1e293b" }}>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>Team Members</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {spotMembers.map((m) => {
              const booked = bookings[`${m.id}-${ds}`];
              return (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "4px 0" }}>
                  <span style={{ color: "#cbd5e1" }}>{m.name}</span>
                  {booked
                    ? <span className="badge" style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", fontSize: 10 }}>Booked</span>
                    : <span className="badge" style={{ background: "#0f172a", color: "#475569", fontSize: 10 }}>—</span>
                  }
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotCard;

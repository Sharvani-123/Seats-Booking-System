import { useClock } from "../../hooks";
import { batchColor, batchBg, getMemberInitials } from "../../utils";
import { useAuth } from "../../context/AuthContext";

const Header = ({ selectedDate }) => {
  const now = useClock();
  const { currentUser, logout } = useAuth();
  const isAfter3PM = now.getHours() >= 15;
  const hour = now.getHours();
  const min  = String(now.getMinutes()).padStart(2, "0");

  // Week display: purely cosmetic, backend drives the real logic
  const weekNum = Math.ceil(
    ((new Date(selectedDate) - new Date(new Date(selectedDate).getFullYear(), 0, 1)) / 86400000
      + new Date(new Date(selectedDate).getFullYear(), 0, 1).getDay() + 1) / 7
  );
  const weekParity = weekNum % 2 === 0 ? 2 : 1;

  return (
    <div style={{
      background: "#070c18", borderBottom: "1px solid #1e293b",
      padding: "14px 28px", display: "flex", alignItems: "center",
      justifyContent: "space-between", gap: 12, flexWrap: "wrap",
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 900, color: "#fff",
        }}>W</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px" }}>
            WISSEN Technology
          </div>
          <div style={{ fontSize: 12, color: "#475569" }}>Seat Booking System</div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: isAfter3PM ? "#10b981" : "#eab308" }}>
            {isAfter3PM ? "🟢 Floater Booking Open" : "🟡 Floater Booking Closed"}
          </div>
          <div style={{ fontSize: 11, color: "#475569" }}>{hour}:{min} · Opens at 15:00</div>
        </div>
        <div style={{ background: "#1e293b", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#64748b" }}>
          Week {weekParity}
        </div>
        {currentUser && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 6px 6px 12px", background: "#111827", border: "1px solid #1e293b", borderRadius: 40 }}>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: "#475569" }}>{currentUser.designatedSeat}</div>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: batchBg(currentUser.batch),
              border: `1.5px solid ${batchColor(currentUser.batch)}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, color: batchColor(currentUser.batch), fontSize: 12,
            }}>
              {getMemberInitials(currentUser.name)}
            </div>
            <button onClick={logout} style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 20, color: "#ef4444", cursor: "pointer",
              fontSize: 11, fontWeight: 600, padding: "5px 10px", fontFamily: "inherit",
            }}>Sign out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

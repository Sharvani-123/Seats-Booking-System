import { MEMBERS } from "../data";
import { useBooking } from "../context/BookingContext";
import { isWorkingDay, batchColor, batchBg, formatDate, dateStr, getMemberInitials } from "../utils";
import MemberAvatar from "../components/ui/MemberAvatar";

const MembersPage = ({ selectedDate }) => {
  const { bookings } = useBooking();
  const ds = dateStr(selectedDate);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>
          All Members — {formatDate(selectedDate)}
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="badge" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>Batch 1: 40</span>
          <span className="badge" style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>Batch 2: 40</span>
        </div>
      </div>

      {[1, 2].map((batch) => {
        const batchMembers = MEMBERS.filter((m) => m.batch === batch);
        const working = isWorkingDay(batch, selectedDate);

        return (
          <div key={batch} style={{ marginBottom: 32 }}>
            {/* Batch header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: batchColor(batch) }} />
              <h3 style={{ fontWeight: 700, fontSize: 16 }}>Batch {batch}</h3>
              <span className="badge" style={{
                background: working ? batchBg(batch) : "rgba(100,116,139,0.1)",
                color: working ? batchColor(batch) : "#64748b",
                fontSize: 10,
              }}>
                {working ? "Working Today" : "Off Today"}
              </span>
            </div>

            {/* Member grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
              {batchMembers.map((m) => {
                const booked = bookings[`${m.id}-${ds}`];
                return (
                  <div key={m.id} style={{
                    background: "#0f172a", border: "1px solid #1e293b",
                    borderRadius: 12, padding: "12px 16px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <MemberAvatar member={m} size={32} fontSize={12} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{m.designatedSeat}</div>
                      </div>
                    </div>
                    {booked
                      ? <span className="badge" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", fontSize: 10 }}>✓ Booked</span>
                      : <span className="badge" style={{ background: "#111827", color: "#475569", fontSize: 10 }}>—</span>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MembersPage;

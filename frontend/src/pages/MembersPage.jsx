import { useEffect, useState } from "react";
import { apiGetMembers } from "../api";
import { formatDate, dateStr, batchColor, batchBg, getMemberInitials } from "../utils";
import MemberAvatar from "../components/ui/MemberAvatar";

const MembersPage = ({ selectedDate }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const ds = dateStr(selectedDate);

  useEffect(() => {
    setLoading(true);
    apiGetMembers(ds)
      .then((res) => setMembers(res.members || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ds]);

  const batch1 = members.filter((m) => m.batch === 1);
  const batch2 = members.filter((m) => m.batch === 2);

  if (loading) return <div style={{ color: "#475569", padding: 40, textAlign: "center" }}>Loading members…</div>;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>All Members — {formatDate(selectedDate)}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="badge" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>Batch 1: {batch1.length}</span>
          <span className="badge" style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>Batch 2: {batch2.length}</span>
        </div>
      </div>

      {[1, 2].map((batch) => {
        const batchMembers = batch === 1 ? batch1 : batch2;
        return (
          <div key={batch} style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: batchColor(batch) }} />
              <h3 style={{ fontWeight: 700, fontSize: 16 }}>Batch {batch}</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
              {batchMembers.map((m) => (
                <div key={m._id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <MemberAvatar member={m} size={32} fontSize={12} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{m.designatedSeat}</div>
                    </div>
                  </div>
                  {m.bookedSeat
                    ? <span className="badge" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", fontSize: 10 }}>✓ Booked</span>
                    : <span className="badge" style={{ background: "#111827", color: "#475569", fontSize: 10 }}>—</span>
                  }
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MembersPage;

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useClock } from "../hooks";
import {
  apiGetMyBooking, apiBookDesignated,
  apiReleaseDesignated, apiBookFloater, apiGetFloaterSeats,
} from "../api";
import { formatDate, dateStr, getWeekdays, batchColor } from "../utils";
import MemberAvatar from "../components/ui/MemberAvatar";

const DAY_NAMES = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// ── Floater Modal ─────────────────────────────────────────────────────────────
const FloaterModal = ({ floaters, onBook, onClose, isAfter3PM, now }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Book Floater Seat</h3>
      {!isAfter3PM && (
        <div style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ color: "#eab308", fontSize: 13, fontWeight: 600 }}>
            ⏰ Floater booking opens at 3:00 PM · Now: {now.getHours()}:{String(now.getMinutes()).padStart(2,"0")}
          </p>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {floaters.length === 0
          ? <p style={{ color: "#64748b", textAlign: "center", padding: 24 }}>No floater seats available.</p>
          : floaters.map((f) => (
            <button key={f._id} className="btn" onClick={() => onBook(f._id)}
              style={{
                background: isAfter3PM ? "rgba(59,130,246,0.15)" : "#1e293b",
                color: isAfter3PM ? "#3b82f6" : "#64748b",
                border: `1px solid ${isAfter3PM ? "rgba(59,130,246,0.3)" : "#1e293b"}`,
                padding: "12px 16px", textAlign: "left", borderRadius: 10, fontSize: 14,
                opacity: isAfter3PM ? 1 : 0.6, cursor: isAfter3PM ? "pointer" : "not-allowed",
              }}>
              🪑 {f.label}
            </button>
          ))
        }
      </div>
      <button className="btn" onClick={onClose} style={{ background: "#1e293b", color: "#94a3b8", marginTop: 16, width: "100%" }}>Cancel</button>
    </div>
  </div>
);

// ── Date row ──────────────────────────────────────────────────────────────────
const DateRow = ({ date, today, member, showNotif, onRefresh }) => {
  const [booking, setBooking]       = useState(null);
  const [loadingRow, setLoadingRow] = useState(true);
  const [floaterModal, setFloaterModal] = useState(false);
  const [floaters, setFloaters]     = useState([]);
  const now = useClock();
  const isAfter3PM = now.getHours() >= 15;

  const ds      = dateStr(date);
  const todayDs = dateStr(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDs = dateStr(tomorrow);
  const isPast  = date < today;
  const isToday = ds === todayDs;
  const isTomorrow = ds === tomorrowDs;
  const jsDay   = date.getDay();
  const dayName = DAY_NAMES[jsDay] || "";

  useEffect(() => {
    apiGetMyBooking(ds)
      .then((res) => setBooking(res.booking))
      .catch(() => setBooking(null))
      .finally(() => setLoadingRow(false));
  }, [ds]);

  const handleBook = async () => {
    try {
      await apiBookDesignated(ds);
      showNotif(`✓ ${member.designatedSeat} booked`);
      onRefresh(ds);
      const res = await apiGetMyBooking(ds);
      setBooking(res.booking);
    } catch (err) { showNotif(err.message, "error"); }
  };

  const handleRelease = async () => {
    try {
      await apiReleaseDesignated(ds);
      showNotif("Seat released — now a floater");
      setBooking(null);
    } catch (err) { showNotif(err.message, "error"); }
  };

  const openFloaterModal = async () => {
    const res = await apiGetFloaterSeats(ds);
    setFloaters(res.floaterSeats || []);
    setFloaterModal(true);
  };

  const handleBookFloater = async (floaterSeatId) => {
    try {
      await apiBookFloater(floaterSeatId);
      showNotif("✓ Floater seat booked");
      setFloaterModal(false);
      const res = await apiGetMyBooking(ds);
      setBooking(res.booking);
    } catch (err) { showNotif(err.message, "error"); }
  };

  // The backend tells us if it's a working day via the booking response;
  // but we need to show the row state before booking. We rely on backend errors for rule enforcement.
  // For display, we use a light heuristic from the API's floorplan (spot.working).
  // Simplified: show "Book Designated" always; backend will reject if it's an off-day.

  return (
    <>
      <div style={{ background: "#0f172a", border: `1px solid ${isToday ? "#3b82f6" : "#1e293b"}`, borderRadius: 14, padding: "16px 20px", opacity: isPast ? 0.45 : 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{dayName}, {formatDate(date)}</span>
              {isToday && <span className="badge" style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", fontSize: 10 }}>TODAY</span>}
            </div>
            {booking && <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Booked: <span style={{ color: "#3b82f6" }}>{booking.seatLabel}</span></div>}
          </div>

          {!isPast && (
            loadingRow ? <span style={{ fontSize: 12, color: "#475569" }}>…</span> :
            booking ? (
              booking.seatType === "designated" && (
                <button className="btn" onClick={handleRelease} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                  Release Seat
                </button>
              )
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={handleBook} style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)" }}>
                  Book {member.designatedSeat}
                </button>
                {isTomorrow && (
                  <button className="btn" onClick={openFloaterModal} style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                    Book Floater (Next Day)
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {floaterModal && (
        <FloaterModal floaters={floaters} onBook={handleBookFloater} onClose={() => setFloaterModal(false)} isAfter3PM={isAfter3PM} now={now} />
      )}
    </>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const MyBookingPage = ({ showNotif }) => {
  const { currentUser } = useAuth();
  const [refreshKey, setRefreshKey] = useState({});

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dateOptions = getWeekdays(today, 14);
  const now = useClock();
  const isAfter3PM = now.getHours() >= 15;

  if (!currentUser) {
    return (
      <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h3 style={{ fontWeight: 700, fontSize: 20 }}>Sign in to manage your booking</h3>
        <p style={{ color: "#475569", fontSize: 14, textAlign: "center", maxWidth: 340 }}>
          Dashboard and Floor Plan are visible to everyone. Sign in to book or release your seat.
        </p>
      </div>
    );
  }

  const member = currentUser;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>My Booking</h2>

      {/* Identity card */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", marginBottom: 24, background: "#0f172a", border: `1px solid ${batchColor(member.batch)}30`, borderRadius: 16 }}>
        <MemberAvatar member={member} size={52} fontSize={20} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#f1f5f9" }}>{member.name}</div>
          <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>
            Batch {member.batch} · {member.designatedSeat} · Spot {String.fromCharCode(64 + member.spotId)}
          </div>
        </div>
        <div style={{ textAlign: "right", padding: "8px 14px", background: isAfter3PM ? "rgba(16,185,129,0.08)" : "rgba(234,179,8,0.08)", border: `1px solid ${isAfter3PM ? "rgba(16,185,129,0.2)" : "rgba(234,179,8,0.2)"}`, borderRadius: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: isAfter3PM ? "#10b981" : "#eab308" }}>
            {isAfter3PM ? "🟢 Floater Open" : "🟡 Floater Closed"}
          </div>
          <div style={{ fontSize: 11, color: "#475569" }}>{isAfter3PM ? "Can book floater seats" : "Opens at 3:00 PM"}</div>
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", letterSpacing: "0.5px", marginBottom: 12 }}>UPCOMING 14 WORKING DAYS</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {dateOptions.map((d) => (
          <DateRow key={dateStr(d)} date={d} today={today} member={member} showNotif={showNotif}
            onRefresh={(ds) => setRefreshKey((prev) => ({ ...prev, [ds]: Date.now() }))} />
        ))}
      </div>
    </div>
  );
};

export default MyBookingPage;

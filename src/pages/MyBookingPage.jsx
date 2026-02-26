import { useState } from "react";
import { DAY_NAMES } from "../data";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import { useClock } from "../hooks";
import {
  isWorkingDay, getWeekParity, formatDate, dateStr, getWeekdays,
  batchColor, batchBg,
} from "../utils";
import MemberAvatar from "../components/ui/MemberAvatar";
import FloaterBookingModal from "../components/ui/FloaterBookingModal";

const BookingDateRow = ({ member, date, today, onFloaterOpen }) => {
  const { bookings, bookDesignatedSeat, releaseDesignatedSeat } = useBooking();
  const ds        = dateStr(date);
  const todayDs   = dateStr(today);
  const isPast    = date < today;
  const isToday   = ds === todayDs;
  const isWorking = isWorkingDay(member.batch, date);
  const booked    = bookings[`${member.id}-${ds}`];
  const week      = getWeekParity(date);
  const jsDay     = new Date(date).getDay();
  const dayName   = DAY_NAMES[jsDay] || "";

  const handleDesignated = () => {
    if (booked) releaseDesignatedSeat(member, date);
    else        bookDesignatedSeat(member, date);
  };

  return (
    <div style={{
      background: "#0f172a",
      border: `1px solid ${isToday ? "#3b82f6" : "#1e293b"}`,
      borderRadius: 14, padding: "16px 20px",
      opacity: isPast ? 0.45 : 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{dayName}, {formatDate(date)}</span>
            {isToday && <span className="badge" style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", fontSize: 10 }}>TODAY</span>}
            <span className="badge" style={{
              background: isWorking ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)",
              color: isWorking ? "#10b981" : "#64748b", fontSize: 10,
            }}>
              {isWorking ? "Working Day" : "Off Day"}
            </span>
            <span style={{ fontSize: 11, color: "#475569" }}>Week {week}</span>
          </div>
          {booked && (
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              Booked: <span style={{ color: "#3b82f6" }}>{booked}</span>
            </div>
          )}
        </div>
        <div>
          {isPast ? (
            <span style={{ fontSize: 12, color: "#475569" }}>Past date</span>
          ) : isWorking ? (
            <button className="btn" onClick={handleDesignated}
              style={booked
                ? { background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }
                : { background: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)" }
              }>
              {booked ? "Release Seat" : `Book ${member.designatedSeat}`}
            </button>
          ) : booked ? (
            <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>✓ {booked}</span>
          ) : (
            <button className="btn" disabled={!isToday} onClick={() => isToday && onFloaterOpen(date)}
              style={isToday
                ? { background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }
                : { background: "#1e293b", color: "#475569", border: "1px solid #1e293b" }
              }>
              {isToday ? "Book Floater" : "Next Day Only"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const MyBookingPage = ({ showNotif }) => {
  const { currentUser } = useAuth();
  const { getFloaterSeats } = useBooking();
  const [floaterModal, setFloaterModal] = useState(null);
  const now = useClock();
  const isAfter3PM = now.getHours() >= 15;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateOptions = getWeekdays(today, 14);

  if (!currentUser) {
    return (
      <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h3 style={{ fontWeight: 700, fontSize: 20 }}>Sign in to manage your booking</h3>
        <p style={{ color: "#475569", fontSize: 14, textAlign: "center", maxWidth: 340 }}>
          Dashboard and Floor Plan are visible to everyone. Sign in to book or release your own seat.
        </p>
      </div>
    );
  }

  const member = currentUser;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>My Booking</h2>

      {/* Identity card */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "18px 22px", marginBottom: 24,
        background: "#0f172a", border: `1px solid ${batchColor(member.batch)}30`, borderRadius: 16,
      }}>
        <MemberAvatar member={member} size={52} fontSize={20} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#f1f5f9" }}>{member.name}</div>
          <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>
            Batch {member.batch} &nbsp;·&nbsp; {member.designatedSeat} &nbsp;·&nbsp; Spot {String.fromCharCode(64 + member.spotId)}
          </div>
        </div>
        <div style={{
          textAlign: "right", padding: "8px 14px",
          background: isAfter3PM ? "rgba(16,185,129,0.08)" : "rgba(234,179,8,0.08)",
          border: `1px solid ${isAfter3PM ? "rgba(16,185,129,0.2)" : "rgba(234,179,8,0.2)"}`, borderRadius: 10,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: isAfter3PM ? "#10b981" : "#eab308" }}>
            {isAfter3PM ? "🟢 Floater Open" : "🟡 Floater Closed"}
          </div>
          <div style={{ fontSize: 11, color: "#475569" }}>{isAfter3PM ? "Can book floater seats" : "Opens at 3:00 PM"}</div>
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", letterSpacing: "0.5px", marginBottom: 12 }}>
        UPCOMING 14 WORKING DAYS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {dateOptions.map((d) => (
          <BookingDateRow key={dateStr(d)} member={member} date={d} today={today}
            onFloaterOpen={(date) => setFloaterModal({ date })} />
        ))}
      </div>

      {floaterModal && (
        <FloaterBookingModal
          member={member} date={floaterModal.date}
          floaters={getFloaterSeats(floaterModal.date)}
          onClose={() => setFloaterModal(null)}
          onNotify={(msg, type) => showNotif && showNotif(msg, type)}
        />
      )}
    </div>
  );
};

export default MyBookingPage;

import { useBooking } from "../../context/BookingContext";
import { useClock, useNotification } from "../../hooks";

const FloaterBookingModal = ({ member, date, floaters, onClose, onNotify }) => {
  const { bookFloaterSeat } = useBooking();
  const now = useClock();
  const isAfter3PM = now.getHours() >= 15;
  const currentHour = now.getHours();
  const currentMin  = String(now.getMinutes()).padStart(2, "0");

  const handleBook = (floater) => {
    const result = bookFloaterSeat(member, date, floater, isAfter3PM);
    onNotify(result.msg, result.ok ? "success" : "error");
    if (result.ok) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
          Book Floater Seat
        </h3>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
          Booking as <strong style={{ color: "#e2e8f0" }}>{member.name}</strong>
        </p>

        {!isAfter3PM && (
          <div style={{
            background: "rgba(234,179,8,0.1)",
            border: "1px solid rgba(234,179,8,0.3)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 16,
          }}>
            <p style={{ color: "#eab308", fontSize: 13, fontWeight: 600 }}>
              ⏰ Floater booking opens at 3:00 PM &nbsp;·&nbsp; Now: {currentHour}:{currentMin}
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {floaters.length === 0 ? (
            <p style={{ color: "#64748b", textAlign: "center", padding: 24 }}>
              No floater seats available for this date.
            </p>
          ) : (
            floaters.map((f) => (
              <button
                key={f.key}
                className="btn"
                onClick={() => handleBook(f)}
                style={{
                  background: isAfter3PM ? "rgba(59,130,246,0.15)" : "#1e293b",
                  color:      isAfter3PM ? "#3b82f6"               : "#64748b",
                  border:     `1px solid ${isAfter3PM ? "rgba(59,130,246,0.3)" : "#1e293b"}`,
                  padding: "12px 16px", textAlign: "left",
                  borderRadius: 10, fontSize: 14,
                  opacity: isAfter3PM ? 1 : 0.6,
                  cursor: isAfter3PM ? "pointer" : "not-allowed",
                }}
              >
                🪑 {f.label}
              </button>
            ))
          )}
        </div>

        <button
          className="btn"
          onClick={onClose}
          style={{ background: "#1e293b", color: "#94a3b8", marginTop: 16, width: "100%" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FloaterBookingModal;

import { createContext, useContext, useState, useCallback } from "react";
import { dateStr } from "../utils";
import { BUFFER_SEAT_COUNT } from "../data";

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  // { `${memberId}-${dateStr}` → seatLabel }
  const [bookings, setBookings] = useState({});
  // { `${spotId}-${seatNum}-${dateStr}` → true }  — seat released by member
  const [releasedSeats, setReleasedSeats] = useState({});
  // { floaterKey → `${memberId}${dateStr}` }       — who booked the floater
  const [floaterBookings, setFloaterBookings] = useState({});

  /* ── helpers ── */
  const getMemberBooking = useCallback(
    (memberId, date) => bookings[`${memberId}-${dateStr(date)}`],
    [bookings]
  );

  const getFloaterSeats = useCallback(
    (date) => {
      const ds = dateStr(date);
      const seats = [];

      // Always-available buffer seats
      for (let i = 1; i <= BUFFER_SEAT_COUNT; i++) {
        const key = `BUFFER-${i}-${ds}`;
        if (!floaterBookings[key]) {
          seats.push({ type: "buffer", id: `BUFFER-${i}`, key, label: `Buffer Seat ${i}` });
        }
      }

      // Released designated seats
      Object.entries(releasedSeats).forEach(([k, released]) => {
        if (released && k.endsWith(ds)) {
          const [spotId, seatNum] = k.split("-");
          const fKey = `${spotId}-${seatNum}-${ds}`;
          if (!floaterBookings[fKey]) {
            seats.push({
              type: "released",
              id: `${spotId}-${seatNum}`,
              key: fKey,
              label: `Spot ${String.fromCharCode(64 + parseInt(spotId))}-S${seatNum} (Released)`,
            });
          }
        }
      });

      return seats;
    },
    [releasedSeats, floaterBookings]
  );

  const getSeatStatus = useCallback(
    (spotId, seatNum, date, member) => {
      const ds    = dateStr(date);
      const rKey  = `${spotId}-${seatNum}-${ds}`;
      const bKey  = `${member?.id}-${ds}`;
      const fBooked = floaterBookings[`${spotId}-${seatNum}-${ds}`];

      if (releasedSeats[rKey] && !fBooked) return "floater";
      if (releasedSeats[rKey] && fBooked)  return "floater-booked";
      if (bookings[bKey])                   return "booked";
      return "available";
    },
    [bookings, releasedSeats, floaterBookings]
  );

  /* ── actions ── */
  const bookDesignatedSeat = useCallback((member, date) => {
    const ds   = dateStr(date);
    const bKey = `${member.id}-${ds}`;
    if (bookings[bKey]) return { ok: false, msg: "Already booked for this date" };
    setBookings((prev) => ({ ...prev, [bKey]: member.designatedSeat }));
    return { ok: true, msg: `✓ ${member.designatedSeat} booked` };
  }, [bookings]);

  const releaseDesignatedSeat = useCallback((member, date) => {
    const ds   = dateStr(date);
    const bKey = `${member.id}-${ds}`;
    const rKey = `${member.spotId}-${member.seatNum}-${ds}`;
    setBookings((prev) => { const n = { ...prev }; delete n[bKey]; return n; });
    setReleasedSeats((prev) => ({ ...prev, [rKey]: true }));
    return { ok: true, msg: "Seat released — now available as floater" };
  }, []);

  const bookFloaterSeat = useCallback((member, date, floater, isAfter3PM) => {
    if (!isAfter3PM) return { ok: false, msg: "Floater seats can only be booked after 3:00 PM" };
    const ds   = dateStr(date);
    const bKey = `${member.id}-${ds}`;
    const alreadyFloater = Object.values(floaterBookings).includes(member.id + ds);
    if (bookings[bKey] || alreadyFloater) return { ok: false, msg: "You already have a booking for this date" };
    setFloaterBookings((prev) => ({ ...prev, [floater.key]: member.id + ds }));
    setBookings((prev) => ({ ...prev, [bKey]: floater.label }));
    return { ok: true, msg: `✓ Floater seat booked: ${floater.label}` };
  }, [bookings, floaterBookings]);

  return (
    <BookingContext.Provider value={{
      bookings,
      releasedSeats,
      floaterBookings,
      getMemberBooking,
      getFloaterSeats,
      getSeatStatus,
      bookDesignatedSeat,
      releaseDesignatedSeat,
      bookFloaterSeat,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
};

import { FloaterSeat } from "../models/FloaterSeat.model.js";
import { Spot } from "../models/Spot.model.js";
import { Booking } from "../models/Booking.model.js";
import { BUFFER_SEAT_COUNT, isWorkingDay, getWeekParity } from "../utils/schedule.utils.js";

const memberDesignatedSeat = (member) =>
  member?.designatedSeat || `Spot ${String.fromCharCode(64 + member.spotId)}-S${member.seatNumber}`;

// ── GET /api/seats/floaters?date=YYYY-MM-DD ───────────────────────────────────
// Returns all available (unbooked) floater seats for a date.
// Buffer seats are upserted into MongoDB on first request so they always
// have real ObjectIds — this fixes the cast error when booking them.
export const getFloaterSeats = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "date query param required." });

    // Step 1: Ensure all 10 buffer seats exist in DB for this date.
    // $setOnInsert means if the doc already exists, nothing changes — fully idempotent.
    const bufferUpserts = [];
    for (let i = 1; i <= BUFFER_SEAT_COUNT; i++) {
      bufferUpserts.push(
        FloaterSeat.findOneAndUpdate(
          { date, label: `Buffer Seat ${i}`, sourceType: "buffer" },
          {
            $setOnInsert: {
              date,
              label: `Buffer Seat ${i}`,
              sourceType: "buffer",
              releasedBy: null,
              bookedBy: null,
            },
          },
          { upsert: true, new: true }
        )
      );
    }
    await Promise.all(bufferUpserts);

    // Step 2: Return all floater seats for this date that haven't been booked yet.
    // Covers both buffer seats (just upserted) and any released designated seats.
    const availableFloaters = await FloaterSeat.find({ date, bookedBy: null });

    res.json({
      floaterSeats: availableFloaters.map((s) => ({
        _id:        s._id,  // real MongoDB ObjectId — safe to pass back for booking
        label:      s.label,
        sourceType: s.sourceType,
        date:       s.date,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/seats/floorplan?date=YYYY-MM-DD ──────────────────────────────────
export const getFloorPlan = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "date query param required." });

    const spots = await Spot.find().sort("spotId");
    const bookings = await Booking.find({ date }).populate("member", "name employeeId spotId seatNumber designatedSeat");
    const releasedSeats = await FloaterSeat.find({ date, sourceType: "released" });

    const bookingMap = {};
    bookings.forEach((b) => {
      if (!b.member) return;
      bookingMap[memberDesignatedSeat(b.member)] = { ...b.toObject(), memberName: b.member.name };
    });

    const releasedLabels = new Set(
      releasedSeats.map((r) => r.label.replace(" (Released)", ""))
    );

    const floor = spots.map((spot) => {
      const working    = isWorkingDay(spot.batch, date);
      const weekParity = getWeekParity(date);
      const seats = Array.from({ length: 8 }, (_, i) => {
        const seatNum   = i + 1;
        const seatLabel = `${spot.name}-S${seatNum}`;
        const booking   = bookingMap[seatLabel];
        const released  = releasedLabels.has(seatLabel);

        let status = "available";
        if (released)                          status = "floater";
        else if (booking?.status === "booked") status = "booked";

        return {
          seatNumber: seatNum,
          seatLabel,
          status,
          bookedBy: booking?.status === "booked"
            ? { name: booking.memberName, employeeId: booking.member.employeeId }
            : null,
        };
      });

      return { spotId: spot.spotId, name: spot.name, batch: spot.batch, working, weekParity, seats };
    });

    res.json({ date, floorPlan: floor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

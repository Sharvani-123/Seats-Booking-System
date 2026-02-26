import { Booking } from "../models/Booking.model.js";
import { FloaterSeat } from "../models/FloaterSeat.model.js";
import mongoose from "mongoose";
import {
  isWorkingDay,
  isAfter3PM,
  todayStr,
} from "../utils/schedule.utils.js";

const getDesignatedSeatLabel = (member) =>
  member.designatedSeat || `Spot ${String.fromCharCode(64 + member.spotId)}-S${member.seatNumber}`;

const nextDayStr = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + 1);
  const ny = dt.getFullYear();
  const nm = String(dt.getMonth() + 1).padStart(2, "0");
  const nd = String(dt.getDate()).padStart(2, "0");
  return `${ny}-${nm}-${nd}`;
};

// ── GET /api/bookings?date=YYYY-MM-DD ─────────────────────────────────────────
// Returns all bookings for a date (used by Floor Plan, Members, Dashboard)
export const getBookingsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "date query param required." });

    const bookings = await Booking.find({ date, status: "booked" })
      .populate("member", "name employeeId designatedSeat batch spotId seatNumber");

    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/bookings/my?date=YYYY-MM-DD ──────────────────────────────────────
// Returns the logged-in member's booking for a specific date (protected)
export const getMyBooking = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "date query param required." });

    const booking = await Booking.findOne({ member: req.member._id, date });
    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/bookings/designated ─────────────────────────────────────────────
// Book the logged-in member's designated seat for a given date (protected)
export const bookDesignatedSeat = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: "date is required." });

    const member = req.member;

    // Rule: can only book working days for designated seat
    if (!isWorkingDay(member.batch, date))
      return res.status(400).json({ message: "This is not a working day for your batch." });

    // Rule: cannot book in the past
    if (date < todayStr())
      return res.status(400).json({ message: "Cannot book for a past date." });

    // Rule: 1 booking per day
    const existing = await Booking.findOne({ member: member._id, date });
    if (existing)
      return res.status(409).json({ message: "You already have a booking for this date." });

    const booking = await Booking.create({
      member:    member._id,
      date,
      seatLabel: getDesignatedSeatLabel(member),
      seatType:  "designated",
      status:    "booked",
    });

    res.status(201).json({ message: "Seat booked successfully.", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/bookings/designated ───────────────────────────────────────────
// Release the logged-in member's designated seat (turns it into a floater)
export const releaseDesignatedSeat = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: "date is required." });

    const member = req.member;

    if (date < todayStr())
      return res.status(400).json({ message: "Cannot release a past booking." });

    const booking = await Booking.findOne({
      member: member._id,
      date,
      seatType: "designated",
      status: "booked",
    });
    if (!booking)
      return res.status(404).json({ message: "No active designated booking found for this date." });

    // Mark as released
    booking.status = "released";
    await booking.save();

    // Create a floater seat entry so others can pick it up
    await FloaterSeat.create({
      date,
      label:      `${getDesignatedSeatLabel(member)} (Released)`,
      sourceType: "released",
      releasedBy: member._id,
    });

    res.json({ message: "Seat released. It is now available as a floater seat." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/bookings/floater ────────────────────────────────────────────────
// Book a floater seat (only on off-days, only after 3 PM, only for next day)
export const bookFloaterSeat = async (req, res) => {
  try {
    const { floaterSeatId } = req.body;
    if (!floaterSeatId)
      return res.status(400).json({ message: "floaterSeatId is required." });
    if (!mongoose.Types.ObjectId.isValid(floaterSeatId))
      return res.status(400).json({ message: "Invalid floaterSeatId." });

    const member = req.member;
    const today = todayStr();
    const targetDate = nextDayStr(today);

    // Rule: floater booking only allowed after 3 PM
    if (!isAfter3PM())
      return res.status(403).json({ message: "Floater seats can only be booked after 3:00 PM." });

    const floater = await FloaterSeat.findById(floaterSeatId);
    if (!floater)
      return res.status(404).json({ message: "Floater seat not found." });

    // Rule: floater bookings only for next day
    if (floater.date !== targetDate)
      return res.status(400).json({ message: "Floater seats can only be booked for next day." });

    // Rule: seat must still be available
    if (floater.bookedBy)
      return res.status(409).json({ message: "This floater seat has already been taken." });

    // Rule: must be an off-day for the member
    if (isWorkingDay(member.batch, targetDate))
      return res.status(400).json({ message: "You cannot book a floater on your working day. Book your designated seat instead." });

    // Rule: 1 booking per day (for target date)
    const existing = await Booking.findOne({ member: member._id, date: targetDate });
    if (existing)
      return res.status(409).json({ message: "You already have a booking for next day." });

    // Claim the floater
    floater.bookedBy = member._id;
    await floater.save();

    const booking = await Booking.create({
      member:    member._id,
      date:      targetDate,
      seatLabel: floater.label,
      seatType:  "floater",
      status:    "booked",
    });

    res.status(201).json({ message: "Floater seat booked successfully.", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

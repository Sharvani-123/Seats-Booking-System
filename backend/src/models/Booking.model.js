import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  member:    { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  date:      { type: String, required: true },   // "YYYY-MM-DD" — keeps timezone-safe
  seatLabel: { type: String, required: true },   // e.g. "Spot A-S1" or "Buffer Seat 3"
  seatType:  { type: String, enum: ["designated", "floater"], required: true },
  status:    { type: String, enum: ["booked", "released"], default: "booked" },
}, { timestamps: true });

// One booking per member per day
bookingSchema.index({ member: 1, date: 1 }, { unique: true });

// Quick lookup: all bookings for a given date
bookingSchema.index({ date: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
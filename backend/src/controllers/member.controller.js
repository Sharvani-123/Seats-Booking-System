import { Member } from "../models/Member.model.js";
import { Booking } from "../models/Booking.model.js";

// GET /api/members?date=YYYY-MM-DD
export const getAllMembers = async (req, res) => {
  try {
    const { date } = req.query;

    const members = await Member.find().sort("spotId seatNumber");

    let bookingMap = {};
    if (date) {
      const bookings = await Booking.find({ date, status: "booked" });
      bookings.forEach((b) => {
        bookingMap[b.member.toString()] = b.seatLabel;
      });
    }

    const result = members.map((m) => ({
      _id:            m._id,
      employeeId:     m.employeeId,
      name:           m.name,
      batch:          m.batch,
      spotId:         m.spotId,
      seatNumber:     m.seatNumber,
      designatedSeat: m.designatedSeat,
      bookedSeat:     bookingMap[m._id.toString()] || null,
    }));

    res.json({ members: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
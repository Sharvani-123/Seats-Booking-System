import { Router } from "express";
import {
  getBookingsByDate,
  getMyBooking,
  bookDesignatedSeat,
  releaseDesignatedSeat,
  bookFloaterSeat,
} from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Public — anyone can see who booked what on a given date
router.get("/", getBookingsByDate);

// Protected — only logged-in member can see/manage their own booking
router.get("/my", protect, getMyBooking);
router.post("/designated", protect, bookDesignatedSeat);
router.delete("/designated", protect, releaseDesignatedSeat);
router.post("/floater", protect, bookFloaterSeat);

export default router;

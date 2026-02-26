import { Router } from "express";
import { getFloaterSeats, getFloorPlan } from "../controllers/seat.controller.js";

const router = Router();

// Both public — anyone can view floor plan and available floater seats
router.get("/floaters",  getFloaterSeats);
router.get("/floorplan", getFloorPlan);

export default router;

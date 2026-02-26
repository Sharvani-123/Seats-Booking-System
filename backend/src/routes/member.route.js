import { Router } from "express";
import { getAllMembers } from "../controllers/member.controller.js";

const router = Router();

// Public — the members list with booking status is visible to everyone
router.get("/", getAllMembers);

export default router;
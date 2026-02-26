import jwt from "jsonwebtoken";
import { Member } from "../models/Member.model.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authenticated. Please sign in." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const member = await Member.findById(decoded.id);
    if (!member) return res.status(401).json({ message: "Member no longer exists." });

    req.member = member; // attach to request for controllers
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token. Please sign in again." });
  }
};
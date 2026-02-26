import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Member } from "../models/Member.model.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password)
      return res.status(400).json({ message: "Employee ID and password are required." });

    // Explicitly select password (it's excluded by default in the schema)
    const member = await Member.findOne({ employeeId }).select("+password");
    if (!member)
      return res.status(401).json({ message: "Employee ID not found." });

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password." });

    const token = signToken(member._id);

    // Don't send the password back
    member.password = undefined;

    res.json({ token, member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  // req.member is set by protect middleware
  res.json({ member: req.member });
};
import mongoose from "mongoose";

const floaterSeatSchema = new mongoose.Schema({
  date:       { type: String, required: true },
  label:      { type: String, required: true },
  sourceType: { type: String, enum: ["buffer", "released"], required: true },
  releasedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: null },
  bookedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: null },
}, { timestamps: true });

// Prevents duplicate buffer seats for the same date — upsert is idempotent
floaterSeatSchema.index({ date: 1, label: 1, sourceType: 1 }, { unique: true });

// Quick lookup: all floaters for a date
floaterSeatSchema.index({ date: 1 });

export const FloaterSeat = mongoose.model("FloaterSeat", floaterSeatSchema);
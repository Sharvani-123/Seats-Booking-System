import mongoose from "mongoose";

const spotSchema = new mongoose.Schema({
  spotId:  { type: Number, required: true, unique: true }, // 1–10
  name:    { type: String, required: true },               // "Spot A"
  batch:   { type: Number, enum: [1, 2], required: true }, // 1 or 2
});

export const Spot = mongoose.model("Spot", spotSchema);
/**
 * Run once: npm run seed
 * Creates all 10 spots, 80 members in MongoDB with hashed passwords.
 * Default password for each employee = their employeeId (e.g. "M1-1")
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Member } from "../models/Member.model.js";
import { Spot } from "../models/Spot.model.js";

dotenv.config();

const FIRST_NAMES = [
  "Aarav","Priya","Rohit","Sneha","Vikram",
  "Ananya","Karan","Divya","Rahul","Meera",
  "Arjun","Pooja","Nikhil","Swati","Amit",
  "Kavya","Siddharth","Riya","Manish","Deepa",
];
const LAST_NAMES = [
  "Sharma","Patel","Singh","Kumar","Verma",
  "Gupta","Joshi","Nair","Reddy","Mehta",
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Spot.deleteMany({});
  await Member.deleteMany({});

  const spots = [];
  for (let i = 1; i <= 10; i++) {
    spots.push({
      spotId: i,
      name: `Spot ${String.fromCharCode(64 + i)}`,
      batch: i <= 5 ? 1 : 2,
    });
  }
  const createdSpots = await Spot.insertMany(spots);
  console.log(`✅ Created ${createdSpots.length} spots`);

  const members = [];
  let idx = 0;
  for (const spot of createdSpots) {
    for (let s = 1; s <= 8; s++) {
      const employeeId = `M${spot.spotId}-${s}`;
      const hashedPassword = await bcrypt.hash(employeeId, 10);
      members.push({
        employeeId,
        name: `${FIRST_NAMES[idx % 20]} ${LAST_NAMES[idx % 10]}`,
        password: hashedPassword,
        spot: spot._id,
        spotId: spot.spotId,
        batch: spot.batch,
        seatNumber: s,
        designatedSeat: `${spot.name}-S${s}`,
      });
      idx++;
    }
  }

  await Member.insertMany(members);
  console.log(`✅ Created ${members.length} members`);
  console.log("🎉 Seed complete. Default password = employeeId (e.g. M1-1)");
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
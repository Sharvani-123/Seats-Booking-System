// ─── SPOTS ────────────────────────────────────────────────────────────────────
export const SPOTS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Spot ${String.fromCharCode(65 + i)}`,
  batch: i < 5 ? 1 : 2,
}));

// ─── BATCH SCHEDULE ───────────────────────────────────────────────────────────
// Day indices: Mon=1, Tue=2, Wed=3, Thu=4, Fri=5
export const BATCH_SCHEDULE = {
  1: { week1: [1, 2, 3], week2: [4, 5] },
  2: { week1: [4, 5],    week2: [1, 2, 3] },
};

export const DAY_NAMES = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// ─── MEMBERS ─────────────────────────────────────────────────────────────────
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

export const MEMBERS = (() => {
  const list = [];
  let idx = 0;
  SPOTS.forEach((spot) => {
    for (let s = 1; s <= 8; s++) {
      list.push({
        id: `M${spot.id}-${s}`,
        name: `${FIRST_NAMES[idx % 20]} ${LAST_NAMES[idx % 10]}`,
        spotId: spot.id,
        batch: spot.batch,
        seatNum: s,
        designatedSeat: `${spot.name}-S${s}`,
      });
      idx++;
    }
  });
  return list;
})();

// ─── BUFFER SEATS COUNT ───────────────────────────────────────────────────────
export const BUFFER_SEAT_COUNT = 10;

import { SPOTS } from "../data";
import SpotCard from "../components/ui/SpotCard";
import { formatDate } from "../utils";

const LEGEND = [
  { color: "#10b981", label: "Available"       },
  { color: "#3b82f6", label: "Booked"          },
  { color: "#f59e0b", label: "Floater (Free)"  },
  { color: "#ef4444", label: "Floater (Taken)" },
];

const FloorPlanPage = ({ selectedDate }) => (
  <div className="fade-in">
    {/* Heading + legend */}
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700 }}>
        Floor Plan — {formatDate(selectedDate)}
      </h2>
      <div style={{ display: "flex", gap: 12, marginLeft: "auto", flexWrap: "wrap" }}>
        {LEGEND.map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>

    {/* Spot grid */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
      {SPOTS.map((spot) => (
        <SpotCard key={spot.id} spot={spot} date={selectedDate} expandable />
      ))}
    </div>
  </div>
);

export default FloorPlanPage;

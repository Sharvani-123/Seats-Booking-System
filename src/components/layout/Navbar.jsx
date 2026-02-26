const Navbar = ({ activeView, onViewChange, currentUser }) => {
  const NAV_ITEMS = [
    { view: "dashboard", label: "📊 Dashboard" },
    { view: "floorplan", label: "🗺️ Floor Plan" },
    { view: "myBooking", label: currentUser ? "🎫 My Booking" : "🔒 My Booking" },
    { view: "members",   label: "👥 Members" },
  ];

  return (
    <div style={{ padding: "12px 28px", display: "flex", gap: 4, borderBottom: "1px solid #0f172a", alignItems: "center" }}>
      {NAV_ITEMS.map(({ view, label }) => (
        <button
          key={view}
          className={`nav-btn ${activeView === view ? "active" : ""}`}
          onClick={() => onViewChange(view)}
        >
          {label}
        </button>
      ))}
      {!currentUser && (
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#334155", fontStyle: "italic" }}>
          Sign in via My Booking to manage your seat
        </span>
      )}
    </div>
  );
};

export default Navbar;

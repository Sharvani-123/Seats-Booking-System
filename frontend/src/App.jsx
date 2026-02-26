import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useDateSelector, useNotification } from "./hooks";

import GlobalStyles  from "./components/ui/GlobalStyles";
import Notification  from "./components/ui/Notification";
import Header        from "./components/layout/Header";
import Navbar        from "./components/layout/Navbar";
import DateSelector  from "./components/layout/DateSelector";

import LoginPage     from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import FloorPlanPage from "./pages/FloorPlanPage";
import MyBookingPage from "./pages/MyBookingPage";
import MembersPage   from "./pages/MembersPage";

const AppContent = () => {
  const { currentUser, loading } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const { today, selectedDate, setSelectedDate, dateOptions } = useDateSelector();
  const { notification, showNotif } = useNotification();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
        <GlobalStyles />
        Loading…
      </div>
    );
  }

  // My Booking requires login
  if (!currentUser && activeView === "myBooking") {
    return (
      <>
        <GlobalStyles />
        <LoginPage />
      </>
    );
  }

  const renderPage = () => {
    switch (activeView) {
      case "dashboard": return <DashboardPage selectedDate={selectedDate} />;
      case "floorplan": return <FloorPlanPage selectedDate={selectedDate} />;
      case "myBooking": return <MyBookingPage showNotif={showNotif} />;
      case "members":   return <MembersPage selectedDate={selectedDate} />;
      default:          return null;
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#0a0f1e", minHeight: "100vh", color: "#e2e8f0" }}>
      <GlobalStyles />
      <Notification notification={notification} />
      <Header selectedDate={selectedDate} />
      <Navbar activeView={activeView} onViewChange={setActiveView} />
      <DateSelector dateOptions={dateOptions} selectedDate={selectedDate} onSelect={setSelectedDate} today={today} />
      <div style={{ padding: "24px 28px" }}>{renderPage()}</div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;

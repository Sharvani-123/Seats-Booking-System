const Notification = ({ notification }) => {
  if (!notification) return null;
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 200,
      background: notification.type === "error" ? "#ef4444" : "#10b981",
      color: "#fff", padding: "12px 20px", borderRadius: 12,
      fontWeight: 600, fontSize: 14,
      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      animation: "fadeIn 0.3s ease",
    }}>
      {notification.msg}
    </div>
  );
};

export default Notification;

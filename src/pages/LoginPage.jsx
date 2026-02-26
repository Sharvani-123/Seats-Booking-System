import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [empId, setEmpId]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!empId.trim() || !password.trim()) {
      setError("Please enter both Employee ID and password.");
      return;
    }
    setLoading(true);
    setError("");
    // Simulate slight network delay
    setTimeout(() => {
      const result = login(empId.trim(), password.trim());
      if (!result.ok) {
        setError(result.msg);
        setLoading(false);
      }
    }, 600);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f1e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: 20,
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 900, color: "#fff",
            margin: "0 auto 16px",
            boxShadow: "0 8px 32px rgba(59,130,246,0.3)",
          }}>
            W
          </div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 26, fontWeight: 700, color: "#f1f5f9",
            letterSpacing: "-0.5px", marginBottom: 6,
          }}>
            WISSEN Technology
          </h1>
          <p style={{ color: "#475569", fontSize: 14 }}>
            Seat Booking System — Sign in to continue
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#111827",
          border: "1px solid #1e293b",
          borderRadius: 20,
          padding: 32,
        }}>
          {/* Emp ID */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.5px" }}>
              EMPLOYEE ID
            </label>
            <input
              type="text"
              placeholder="e.g. M1-1"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              onKeyDown={handleKey}
              style={{
                width: "100%", padding: "12px 16px",
                background: "#0f172a", border: `1px solid ${error ? "#ef4444" : "#1e293b"}`,
                borderRadius: 10, color: "#e2e8f0",
                fontSize: 14, fontFamily: "inherit", outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = error ? "#ef4444" : "#1e293b"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.5px" }}>
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKey}
              style={{
                width: "100%", padding: "12px 16px",
                background: "#0f172a", border: `1px solid ${error ? "#ef4444" : "#1e293b"}`,
                borderRadius: 10, color: "#e2e8f0",
                fontSize: 14, fontFamily: "inherit", outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = error ? "#ef4444" : "#1e293b"}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "10px 14px",
              color: "#f87171", fontSize: 13, marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "13px",
              background: loading ? "#1e293b" : "linear-gradient(135deg, #3b82f6, #6366f1)",
              border: "none", borderRadius: 10,
              color: loading ? "#475569" : "#fff",
              fontSize: 15, fontWeight: 700, fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 16px rgba(59,130,246,0.3)",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>

        {/* Hint for prototype */}
        <div style={{
          marginTop: 20, padding: "14px 18px",
          background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: 12,
        }}>
          <p style={{ fontSize: 12, color: "#475569", marginBottom: 6, fontWeight: 600 }}>
            🔑 PROTOTYPE LOGIN HINT
          </p>
          <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
            Employee ID and password are the same.<br />
            Format: <span style={{ color: "#94a3b8", fontWeight: 600 }}>M[SpotNumber]-[SeatNumber]</span><br />
            Example: <span style={{ color: "#3b82f6", fontWeight: 600 }}>M1-1</span> / <span style={{ color: "#3b82f6", fontWeight: 600 }}>M1-1</span> &nbsp;(Spot A, Seat 1)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

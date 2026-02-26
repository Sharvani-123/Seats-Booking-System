import { createContext, useContext, useState } from "react";
import { MEMBERS } from "../data";

// Each member's "password" is their employee ID for this prototype.
// e.g. Employee M1-1 logs in with empId="M1-1", password="M1-1"
// In production this would be replaced with a real auth API.

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // logged-in member object

  const login = (empId, password) => {
    const member = MEMBERS.find((m) => m.id === empId);
    if (!member) return { ok: false, msg: "Employee ID not found" };
    // Mock: password === empId (simple prototype rule)
    if (password !== empId) return { ok: false, msg: "Incorrect password" };
    setCurrentUser(member);
    return { ok: true };
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

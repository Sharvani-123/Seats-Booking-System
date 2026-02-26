import { createContext, useContext, useState, useEffect } from "react";
import { apiLogin, apiGetMe } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // check existing token on mount

  // On mount: restore session from localStorage token
  useEffect(() => {
    const token = localStorage.getItem("wissen_token");
    if (!token) { setLoading(false); return; }
    apiGetMe()
      .then(({ member }) => setCurrentUser(member))
      .catch(() => localStorage.removeItem("wissen_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (employeeId, password) => {
    const { token, member } = await apiLogin(employeeId, password);
    localStorage.setItem("wissen_token", token);
    setCurrentUser(member);
    return member;
  };

  const logout = () => {
    localStorage.removeItem("wissen_token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
};

import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token") ||
      sessionStorage.getItem("auth_user"),
    );
  });

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.get("/api/v1/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error.message);
    } finally {
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("auth_user");
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

import React, { createContext, useState, useEffect } from "react";
    const API_BASE = process.env.REACT_APP_API_BASE_URL;
export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Securely fetch only admin session from backend
  const fetchAdminUser = async () => {


    if (!API_BASE) {
      console.error("Missing REACT_APP_API_BASE_URL in environment variables!");
    }

    try {
      const res = await fetch(`${API_BASE}/api/user/admin/am`, {
        method: "GET",
        credentials: "include", 
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();

      if (!data?.user || data.user.role !== "admin") {
        throw new Error("Unauthorized access");
      }

      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUser();
  }, []);

  const login = (userData) => {
    if (userData?.role === "admin") {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      // Prevent accidental login as non-admin
      console.warn("Tried to log in non-admin to admin panel");
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

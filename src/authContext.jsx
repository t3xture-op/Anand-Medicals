import React, { createContext, useState, useEffect } from "react";

 export const  AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchRefresh = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include", 
      });

      if (!res.ok) throw new Error("Not logged in");

      const data = await res.json();

      
      const updatedUser = { ...data.user };

      setUser(updatedUser);
      setIsLoggedIn(true);
    } catch (err) {
      console.log("Refresh failed:", err.message);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  fetchRefresh();
}, []);


  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setUser, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export  { AuthProvider};
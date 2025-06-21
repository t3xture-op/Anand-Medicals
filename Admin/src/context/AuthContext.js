import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Securely fetch only admin session from backend
  const fetchAdminUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user/am', {
        method: 'GET',
        credentials: 'include', // Send cookies (adminAccessToken)
      });

      if (!res.ok) throw new Error('Not authenticated');

      const data = await res.json();

      if (!data?.user || data.user.role !== 'admin') {
        throw new Error('Unauthorized access');
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
    if (userData?.role === 'admin') {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      // Prevent accidental login as non-admin
      console.warn('Tried to log in non-admin to admin panel');
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

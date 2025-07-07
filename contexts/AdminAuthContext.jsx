"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in (from localStorage)
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password) => {
    // Check password (in production, this should be more secure)
    if (password === "123456789") {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuthenticated", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

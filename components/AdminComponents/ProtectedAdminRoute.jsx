"use client";
import React from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLogin from "@/components/AdminComponents/AdminLogin";

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return children;
};

export default ProtectedAdminRoute;

"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Please enter password");
      return;
    }

    setIsSubmitting(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      const success = login(password);

      if (success) {
        toast.success("Login successful!");
        setPassword("");
      } else {
        toast.error("Invalid password");
      }

      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Image
              src={assets.logo}
              alt="Blog Logo"
              width={180}
              className="w-32 sm:w-40"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter password to access admin panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              }`}
            >
              {isSubmitting ? "Logging in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

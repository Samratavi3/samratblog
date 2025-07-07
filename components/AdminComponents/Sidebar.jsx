"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex flex-col bg-slate-100 ">
      <div className="px-2 sm:pl-14 py-3 border border-black">
        <Image src={assets.logo} width={120} alt="Blog Logo" />
      </div>
      <div className="w-28 sm:w-80 h-[100vh] relative py-12 border border-black">
        <div className="w-[50%] sm:w-[80%] absolute right-0">
          <Link
            href="/admin/addProduct"
            className="flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000] hover:bg-gray-50 transition-colors"
          >
            <Image src={assets.add_icon} alt="Add icon" width={28} />
            <p>Add Blogs</p>
          </Link>
          <Link
            href="/admin/blogList"
            className="mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000] hover:bg-gray-50 transition-colors"
          >
            <Image src={assets.blog_icon} alt="Blog icon" width={28} />
            <p>Blog list</p>
          </Link>
          <Link
            href="/admin/subscriptions"
            className="mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000] hover:bg-gray-50 transition-colors"
          >
            <Image src={assets.email_icon} alt="Email icon" width={28} />
            <p>Subscriptions</p>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-8 flex items-center border border-red-600 gap-3 font-medium px-3 py-2 bg-red-50 text-red-600 shadow-[-5px_5px_0px_#dc2626] hover:bg-red-100 transition-colors w-full"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <p>Logout</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

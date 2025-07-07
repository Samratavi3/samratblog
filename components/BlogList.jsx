"use client";
import React, { useEffect, useState } from "react";
import BlogItem from "./BlogItem";
import axios from "axios";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/blog");

      if (response.data.success) {
        setBlogs(response.data.blogs);
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();

    // Add event listener to refresh blogs when the page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBlogs();
      }
    };

    const handleFocus = () => {
      fetchBlogs();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const filteredBlogs = blogs
    .filter((item) => (menu === "All" ? true : item.category === menu))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <span className="ml-3 text-lg">Loading blogs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={fetchBlogs}
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-center gap-6 my-10 ">
        <button
          onClick={() => setMenu("All")}
          className={
            menu === "All"
              ? "bg-black text-white py-1 px-4 rounded-sm"
              : "hover:bg-gray-100 py-1 px-4 rounded-sm transition-colors"
          }
        >
          All
        </button>
        <button
          className={
            menu === "Technology"
              ? "bg-black text-white py-1 px-4 rounded-sm"
              : "hover:bg-gray-100 py-1 px-4 rounded-sm transition-colors"
          }
          onClick={() => setMenu("Technology")}
        >
          Technology
        </button>
        <button
          className={
            menu === "Startup"
              ? "bg-black text-white py-1 px-4 rounded-sm"
              : "hover:bg-gray-100 py-1 px-4 rounded-sm transition-colors"
          }
          onClick={() => setMenu("Startup")}
        >
          Startup
        </button>
        <button
          className={
            menu === "Lifestyle"
              ? "bg-black text-white py-1 px-4 rounded-sm"
              : "hover:bg-gray-100 py-1 px-4 rounded-sm transition-colors"
          }
          onClick={() => setMenu("Lifestyle")}
        >
          Lifestyle
        </button>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={fetchBlogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? "Refreshing..." : "Refresh Blogs"}
        </button>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            {menu === "All"
              ? "No blogs available"
              : `No blogs found in "${menu}" category`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-8 mb-12 max-w-7xl mx-auto px-6">
          {filteredBlogs.map((item, index) => (
            <BlogItem
              image={item.image}
              title={item.title}
              description={item.description}
              category={item.category}
              key={item._id || index}
              id={item._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;

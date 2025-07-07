"use client";
import BlogTableitem from "@/components/AdminComponents/BlogTableitem";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BlogListPage = () => {
  const [blogs, setblogs] = useState([]);
  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/api/blog");
      if (response.data.success) {
        // Sort blogs by date (newest first)
        const sortedBlogs = response.data.blogs.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setblogs(sortedBlogs);
      } else {
        setblogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setblogs([]);
    }
  };

  const deleteBlog = async (mongoId) => {
    try {
      const response = await axios.delete("/api/blog", {
        params: {
          id: mongoId,
        },
        headers: {
          "x-admin-auth": "authenticated",
        },
      });
      if (response.data.success) {
        toast.success(response.data.msg);
        fetchBlogs();
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized access");
      } else {
        toast.error("Failed to delete blog");
      }
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, []);
  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1>All Blogs</h1>
      <div className="relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-sm text-gray-700 text-left uppercase bg-gray-50">
            <tr>
              <th scope="col" className="hidden sm:block px-6 py-3 ">
                author name
              </th>
              <th scope="col" className=" px-6 py-3 ">
                Blog Title
              </th>
              <th scope="col" className=" px-6 py-3 ">
                Date Created
              </th>
              <th scope="col" className=" px-6 py-3 ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((item, index) => {
              return (
                <BlogTableitem
                  key={index}
                  mongoId={item._id}
                  title={item.title}
                  author={item.author}
                  date={item.date}
                  deleteBlog={deleteBlog}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogListPage;

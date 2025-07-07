"use client";
import { assets } from "@/assets/assets";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddBlogPage = () => {
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    title: "",
    author: "",
    description: "",
    category: "Technology",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (!data.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!data.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!data.author.trim()) {
      toast.error("Author name is required");
      return;
    }

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title.trim());
      formData.append("description", data.description.trim());
      formData.append("author", data.author.trim());
      formData.append("category", data.category);
      formData.append("image", image);

      const response = await axios.post("/api/blog", formData, {
        headers: {
          "x-admin-auth": "authenticated",
        },
      });

      if (response.data.success) {
        toast.success(response.data.msg);
        setImage(null);
        setData({
          title: "",
          author: "",
          description: "",
          category: "Technology",
        });
        // Reset file input
        const fileInput = document.getElementById("image");
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(response.data.error || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);

      if (error.response?.data?.errors) {
        // Handle validation errors
        error.response.data.errors.forEach((err) => toast.error(err));
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to create blog. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="pt-5 px-5 sm:pt-12 sm:pl-16 max-w-2xl"
    >
      <h1 className="text-2xl font-semibold mb-6">Add New Blog</h1>

      <div className="mb-6">
        <p className="text-xl mb-2">Upload thumbnail</p>
        <label htmlFor="image" className="cursor-pointer">
          <Image
            className="mt-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            width={140}
            height={70}
            alt="Upload area"
          />
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id="image"
          accept="image/*"
          hidden
          required
        />
        {image && (
          <p className="text-sm text-green-600 mt-2">Selected: {image.name}</p>
        )}
      </div>

      <div className="mb-4">
        <p className="text-xl mb-2">Blog Title</p>
        <input
          className="w-full sm:w-[500px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          type="text"
          name="title"
          onChange={onChangeHandler}
          value={data.title}
          placeholder="Enter blog title"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-4">
        <p className="text-xl mb-2">Blog Author</p>
        <input
          className="w-full sm:w-[500px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          type="text"
          name="author"
          onChange={onChangeHandler}
          value={data.author}
          placeholder="Enter author name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-4">
        <p className="text-xl mb-2">Blog Description</p>
        <textarea
          className="w-full sm:w-[500px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-vertical"
          name="description"
          onChange={onChangeHandler}
          value={data.description}
          placeholder="Write your blog content here..."
          required
          disabled={isSubmitting}
          rows={6}
        />
      </div>

      <div className="mb-6">
        <p className="text-xl mb-2">Blog Category</p>
        <select
          className="w-full sm:w-[200px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          name="category"
          onChange={onChangeHandler}
          value={data.category}
          required
          disabled={isSubmitting}
        >
          <option value="Technology">Technology</option>
          <option value="Startup">Startup</option>
          <option value="Lifestyle">Lifestyle</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full sm:w-40 h-12 rounded-md font-medium transition-colors ${
          isSubmitting
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {isSubmitting ? "Adding..." : "Add Blog"}
      </button>
    </form>
  );
};

export default AddBlogPage;

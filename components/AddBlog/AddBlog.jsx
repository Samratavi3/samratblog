"use client";
import { assets } from "@/assets/assets";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddBlog = () => {
  const router = useRouter();
  const [image, setimage] = useState(false);
  const [data, setdata] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setdata((data) => ({ ...data, [name]: value }));
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !data.title ||
      !data.author ||
      !data.description ||
      !data.category ||
      !image
    ) {
      toast.error("Please fill in all fields and upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("author", data.author);
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post("/api/blog", formData, {
        headers: {
          "x-admin-auth": "authenticated",
        },
      });

      if (response.data.success) {
        toast.success(response.data.msg || "Blog created successfully!");
        // Reset form
        setimage(false);
        setdata({
          title: "",
          author: "",
          description: "",
          category: "",
        });

        // Show success message and redirect after 2 seconds
        toast.success("Redirecting to home page to view your new blog...", {
          autoClose: 1500,
        });

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(response.data.error || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized access");
      } else {
        toast.error("Failed to create blog. Please try again.");
      }
    }
  };
  return (
    <form onSubmit={onSubmitHandler} className="pt-5 px-5 sm:pt12 sm:pl-16 ">
      <p className="text-xl">Upload thumbnail</p>
      <label htmlFor="image">
        <Image
          className="mt-4"
          src={!image ? assets.upload_area : URL.createObjectURL(image)}
          width={140}
          height={70}
          alt=""
        />
      </label>
      <input
        onChange={(e) => setimage(e.target.files[0])}
        type="file"
        id="image"
        hidden
        required
      />
      <p className="text-xl mt-4">Blog Title</p>
      <input
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
        type="text"
        name="title"
        onChange={onChangeHandler}
        value={data.title}
        placeholder="Type here"
        required
        id=""
      />
      <p className="text-xl mt-4">Blog Author</p>
      <input
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
        type="text"
        name="author"
        onChange={onChangeHandler}
        value={data.author}
        placeholder="Author Name"
        required
        id=""
      />
      <p className="text-xl mt-4">Blog description</p>
      <textarea
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
        type="text"
        name="description"
        onChange={onChangeHandler}
        value={data.description}
        placeholder="Write content here"
        required
        id=""
        rows={6}
      />
      <p className="text-xl mt-4">Blog Category</p>
      <select
        className="w-40 mt-4 px-4 py-3 border text-gray-500"
        name="category"
        onChange={onChangeHandler}
        value={data.category}
      >
        <option value=""></option>
        <option value="Startup">Startup</option>
        <option value="Technology">Technology</option>
        <option value="Lifestyle">Lifestyle</option>
      </select>
      <br />
      <button type="submit" className="mt-8 w-40 h-12 bg-black text-white">
        Add
      </button>
    </form>
  );
};

export default AddBlog;

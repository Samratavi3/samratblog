"use client";
import { assets } from "@/assets/assets";
import AddBlog from "@/components/AddBlog/AddBlog";
import Footer from "@/components/Footer";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <>
      <ToastContainer />
      <div className="  py-5 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center ">
          <Link href="/">
            <Image
              src={assets.logo}
              width={180}
              className="w-[130px] sm:w-auto"
              alt="Blog Logo"
            />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 font-medium px-3 py-1  sm:px-6 sm:py-3 border border-solid border-black shadow-[-7px_7px_0px_#000000] hover:bg-gray-100 transition-colors"
          >
            Back to Home <Image src={assets.arrow} alt="Arrow icon" />
          </Link>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="text-center py-10 px-5 md:px-12 lg:px-28">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
          Start Your Blogging Journey
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Share your thoughts, ideas, and expertise with the world. Create
          engaging content that inspires and connects with your audience.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-sm shadow-sm">
            <h3 className="font-semibold text-lg mb-2">📝 Write & Publish</h3>
            <p className="text-gray-600">
              Create and publish your blog posts with our easy-to-use editor.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-sm shadow-sm">
            <h3 className="font-semibold text-lg mb-2">🎨 Rich Content</h3>
            <p className="text-gray-600">
              Add images, format text, and create beautiful blog layouts.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-sm shadow-sm">
            <h3 className="font-semibold text-lg mb-2">🌐 Share Ideas</h3>
            <p className="text-gray-600">
              Reach your audience across Technology, Startup, and Lifestyle
              topics.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Creation Section */}
      <div className="mt-10 mb-10">
        <div className="text-center mb-8 px-5 md:px-12 lg:px-28">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Create Your First Blog Post
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-4">
            Fill out the form below to publish your blog post and share it with
            the world.
          </p>
          <p className="text-sm text-blue-600 font-medium">
            ✨ Your blog will appear on the main blog list after creation!
          </p>
        </div>
        <AddBlog />
      </div>

      <Footer />
    </>
  );
};

export default page;

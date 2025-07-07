"use client";
import { assets } from "@/assets/assets";
import Footer from "@/components/Footer";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BlogDetailPage = ({ params }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("/api/blog", {
          params: {
            id: params.id,
          },
        });

        if (response.data.success) {
          setData(response.data.blog);
        } else {
          setError("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        if (error.response?.status === 404) {
          setError("Blog not found");
        } else if (error.response?.status === 400) {
          setError("Invalid blog ID");
        } else {
          setError("Failed to load blog. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBlogData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <span className="ml-3 text-lg">Loading blog...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Link
          href="/"
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg mb-4">Blog not found</p>
        <Link
          href="/"
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28 ">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              src={assets.logo}
              width={180}
              alt=""
              className="w-[130px] sm:w-auto"
            />
          </Link>
          <Link
            href="/getstart"
            className="flex items-center gap-2 py-1 px-3 font-medium sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000] hover:bg-gray-100 transition-colors"
          >
            Get Started <Image src={assets.arrow} alt="" />
          </Link>
        </div>
        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {data.title}
          </h1>
          <Image
            src={"/authorImg.png"}
            width={60}
            height={60}
            alt=""
            className="mx-auto mt-6 border border-white rounded-full "
          />
          <p className="text-lg mt-1 pb-2  max-w-[740px] mx-auto">
            {data.author}
          </p>
        </div>
      </div>
      <div className="mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
        <Image
          className="border-4 border-white"
          src={data.image}
          width={1280}
          height={720}
          alt=""
        />
        <h1 className="my-8 text-[26px] font-semibold">Introduction:</h1>
        <p className="">{data.description}</p>
        <h3 className="my-5 text-[18px] font-semibold">
          Licing elit. Quae dolorum mtiae, facilis.
        </h3>
        <p className="my-3 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nostrum
          facere aliquam alias, tempora dolor libero aspernatur consequuntur
          inventore sunt explicabo eius labore harum odit illum odio
          necessitatibus veniam optio.
        </p>
        <h3 className="my-5 text-[18px] font-semibold">
          Licing elit. Quae dolorum mtiae, facilis.
        </h3>
        <p className="my-3 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nostrum
          facere aliquam alias, tempora dolor libero aspernatur consequuntur
          inventore sunt explicabo eius labore harum odit illum odio
          necessitatibus veniam optio.
        </p>
        <h3 className="my-5 text-[18px] font-semibold">
          Licing elit. Quae dolorum mtiae, facilis.
        </h3>
        <p className="my-3 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nostrum
          facere aliquam alias, tempora dolor libero aspernatur consequuntur
          inventore sunt explicabo eius labore harum odit illum odio
          necessitatibus veniam optio.
        </p>
        <h3 className="my-5 text-[18px] font-semibold">Conclusion</h3>
        <p className="my-3 ">
          olor libero aspernatur consequuntur inventore sunt explicabo eius
          labore harum odit illum odio necessitatibus veniam optio.
        </p>
        <div className="my-24 ">
          <p className="text-black font-semibold my-4 ">Share This Artical</p>
          <div className="flex">
            <Image src={assets.facebook_icon} width={50} alt="" />
            <Image src={assets.twitter_icon} width={50} alt="" />
            <Image src={assets.googleplus_icon} width={50} alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetailPage;

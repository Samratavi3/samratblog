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
            />
          </Link>
          <button
            href="/getstart"
            className="flex items-center gap-2 font-medium px-3 py-1  sm:px-6 sm:py-3 border border-solid border-black shadow-[-7px_7px_0px_#000000]"
          >
            Get Started <Image src={assets.arrow} />
          </button>
        </div>
      </div>
      <div className="mt-10 mb-10">
        <AddBlog />
      </div>
      <Footer />
    </>
  );
};

export default page;

"use client";
import axios from "axios";
import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Header = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("email", email);

      const response = await axios.post("/api/email", formData);

      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail("");
      } else {
        toast.error(response.data.error || "Subscription failed");
      }
    } catch (error) {
      console.error("Subscription error:", error);

      if (error.response?.status === 409) {
        toast.warning("Email already subscribed!");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error || "Invalid email address");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="  py-5 px-5 md:px-12 lg:px-28">
      <div className="flex justify-between items-center ">
        <Image
          src={assets.logo}
          width={180}
          className="w-[130px] sm:w-auto"
          alt="Blog Logo"
        />
        <Link
          href="/getstart"
          className="flex items-center gap-2 font-medium px-3 py-1  sm:px-6 sm:py-3 border border-solid border-black shadow-[-7px_7px_0px_#000000] hover:bg-gray-100 transition-colors"
        >
          Get Started <Image src={assets.arrow} alt="Arrow icon" />
        </Link>
      </div>
      <div className="text-center items-center justify-center ">
        <h1 className="text-3xl sm:text-5xl font-medium">Latest Blog</h1>
        <p className="mt-10 max-w-[740px] m-auto text-xs sm:text-base">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio
          voluptas nobis nulla repellat eligendi dicta officiis quia, ipsa id
          perspiciatis, dolorem laborum reiciendis, illum iure facilis eaque
          sequi quidem at?
        </p>
        <form
          onSubmit={onSubmitHandler}
          className="flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black  shadow-[-7px_7px_0px_#000000]"
        >
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter Your email"
            className="pl-4 outline-none flex-1"
            disabled={isSubmitting}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`border-l border-black py-4 px-4 sm:px-8 transition-colors ${
              isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "active:bg-gray-600 active:text-white hover:bg-gray-100"
            }`}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;

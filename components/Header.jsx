"use client";
import { FiMail } from "react-icons/fi";
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
    <div className="py-4 px-2 sm:px-5 md:px-8 lg:px-20">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <Image
          src={assets.logo}
          width={140}
          height={40}
          className="w-[110px] sm:w-[140px]"
          alt="Blog Logo"
        />
        <Link
          href="/getstart"
          className="flex items-center gap-2 font-medium px-2 py-1 sm:px-5 sm:py-2 border border-solid border-black shadow-[-5px_5px_0px_#000000] hover:bg-gray-100 transition-colors text-sm sm:text-base"
        >
          Get Started{" "}
          <Image src={assets.arrow} alt="Arrow icon" width={10} height={10} />
        </Link>
      </div>
      <div className="text-center items-center justify-center ">
        <h1 className="text-2xl xs:text-3xl sm:text-5xl font-medium">
          Latest Blog
        </h1>
        <p className="mt-6 sm:mt-10 max-w-[95vw] sm:max-w-[740px] m-auto text-xs sm:text-base px-2">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio
          voluptas nobis nulla repellat eligendi dicta officiis quia, ipsa id
          perspiciatis, dolorem laborum reiciendis, illum iure facilis eaque
          sequi quidem at?
        </p>
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col sm:flex-row justify-between max-w-[95vw] sm:max-w-[500px] scale-100 mx-auto mt-8 border border-black shadow-[-5px_5px_0px_#000000]"
        >
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter Your email"
            className="pl-3 py-3 outline-none flex-1 text-sm sm:text-base border-b sm:border-b-0 sm:border-r border-black"
            disabled={isSubmitting}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto py-3 px-4 sm:px-8 rounded-b sm:rounded-b-none sm:rounded-r transition-colors text-sm sm:text-base font-semibold tracking-wide flex items-center justify-center gap-2 ${
              isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "active:bg-gray-600 active:text-white hover:bg-gray-100"
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="block sm:hidden">
                  <FiMail className="animate-spin" size={20} />
                </span>
                <span className="hidden sm:inline">Subscribing...</span>
              </>
            ) : (
              <>
                <span className="block sm:hidden">
                  <FiMail size={20} />
                </span>
                <span className="hidden sm:inline">Subscribe</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;

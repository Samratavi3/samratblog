"use client";
import axios from "axios";
import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Header = () => {
  const [email, setemail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);

    const response = await axios.post("/api/email", formData);
    if (response.data.success) {
      toast.success(response.success);
      setemail("");
    } else {
      toast.error("error");
    }
  };
  return (
    <div className="  py-5 px-5 md:px-12 lg:px-28">
      <div className="flex justify-between items-center ">
        <Image src={assets.logo} width={180} className="w-[130px] sm:w-auto" />
        <Link
          href="/getstart"
          className="flex items-center gap-2 font-medium px-3 py-1  sm:px-6 sm:py-3 border border-solid border-black shadow-[-7px_7px_0px_#000000]"
        >
          Get Started <Image src={assets.arrow} />
        </Link>
      </div>
      <div className="text-center items-center justify-center ">
        <h1 className="text-3xl sm:text-5xl font-medium">Latest Blog</h1>
        <p className="mt-10 mx-w-[740px] m-auto text-xs sm:text-base">
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
            onChange={(e) => setemail(e.target.value)}
            value={email}
            placeholder="Enter Your email"
            className="pl-4 outline-none "
          />
          <button
            type="submit"
            className="borber-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white"
          >
            Subcribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;

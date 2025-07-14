import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row bg-black py-5 items-center justify-between px-4 sm:px-10">
      <Image
        src={assets.logo_light}
        alt="Blog Logo"
        width={100}
        height={40}
        className="mb-2 sm:mb-0"
      />
      <p className="text-xs sm:text-sm text-white text-center">
        All rights reserved 2025
      </p>
      <div className="flex gap-2">
        <Image
          src={assets.facebook_icon}
          alt="Facebook"
          width={40}
          height={40}
        />
        <Image src={assets.twitter_icon} alt="Twitter" width={40} height={40} />
        <Image
          src={assets.googleplus_icon}
          alt="Google Plus"
          width={40}
          height={40}
        />
      </div>
    </div>
  );
};

export default Footer;

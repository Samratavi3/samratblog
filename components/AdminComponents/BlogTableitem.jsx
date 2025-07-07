import Image from "next/image";
import React from "react";

const BlogTableitem = ({ title, author, date, deleteBlog, mongoId }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    const blogDate = new Date(dateString);

    // Check if the date is valid
    if (isNaN(blogDate.getTime())) return "Invalid date";

    // Calculate time difference
    const now = new Date();
    const diffInMs = now - blogDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    let relativeTime = "";
    if (diffInMinutes < 1) {
      relativeTime = "Just now";
    } else if (diffInMinutes < 60) {
      relativeTime = `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      relativeTime = `${diffInHours}h ago`;
    } else if (diffInDays < 30) {
      relativeTime = `${diffInDays}d ago`;
    } else {
      relativeTime = blogDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    // Format full date for tooltip
    const fullDate = blogDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { relativeTime, fullDate };
  };
  return (
    <tr className="bg-white border-b ">
      <th
        scope="row"
        className="items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        <Image src={"/authorImg.png"} height={40} width={40} alt="Author" />
        <p>{author ? author : "No Author"}</p>
      </th>
      <td className="px-6 py-4">{title ? title : "no title"}</td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {formatDate(date).relativeTime}
          </span>
          <span
            className="text-xs text-gray-500"
            title={formatDate(date).fullDate}
          >
            {formatDate(date).fullDate}
          </span>
        </div>
      </td>
      <td
        onClick={() => deleteBlog(mongoId)}
        className="px-6 py-4 cursor-pointer"
      >
        X
      </td>
    </tr>
  );
};

export default BlogTableitem;

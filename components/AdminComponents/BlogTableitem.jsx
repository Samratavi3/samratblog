import Image from "next/image";
import React from "react";

const BlogTableitem = ({ title, author, date, deleteBlog, mongoId }) => {
  const blogDate = new Date(date);
  return (
    <tr className="bg-white borber-b ">
      <th
        scope="row"
        className="item-center gap-3 hidden sm:flex px-6py-4 font-medium text-gray-900 whitespace-nowrap "
      >
        <Image src={"/authorImg.png"} height={40} width={40} />
        <p>{author ? author : "No Author"}</p>
      </th>
      <td className="px-6 py-4">{title ? title : "no title"}</td>
      <td className="px-6 py-4">{blogDate.toDateString()}</td>
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

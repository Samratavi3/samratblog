import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const BlogItem = ({ id, title, description, category, image }) => {
  return (
    <div className="w-full max-w-sm bg-white border border-black hover:shadow-[-7px_7px_0px_#000000] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105">
      <Link href={`/blogs/${id}`}>
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="border-b border-black rounded-t-lg object-cover h-[200px] w-full"
        />
      </Link>

      <p className="ml-4 mt-4 px-2 py-1 inline-block bg-black text-white text-xs rounded-sm">
        {category}
      </p>
      <div className="p-4">
        <h5 className="mb-2 text-base font-medium tracking-tight text-gray-900 line-clamp-2">
          {title}
        </h5>
        <p className="mb-3 text-xs tracking-tight text-gray-700 line-clamp-3">
          {description}
        </p>

        <Link
          href={`/blogs/${id}`}
          className="inline-flex items-center py-1 font-semibold text-center text-sm hover:text-gray-600 transition-colors"
        >
          Read more
          <Image src={assets.arrow} width={10} className="ml-2" alt="" />
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;

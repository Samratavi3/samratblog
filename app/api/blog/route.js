import { connectDB } from "@/lib/config/db";
import blogModel from "@/lib/models/blogModel";
import { writeFile } from "fs/promises";
const fs = require("fs");
const { NextResponse } = require("next/server");

const loadDB = async () => {
  await connectDB();
};

loadDB();

export async function GET(request) {
  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await blogModel.findById(blogId);
    return NextResponse.json(blog);
  } else {
    const blogs = await blogModel.find({});
    return NextResponse.json({ blogs });
  }
}
// api endpoint for uploading blogs

export async function POST(request) {
  const formData = await request.formData();
  const timestamp = Date.now();
  const image = formData.get("image");
  const imageByteData = await image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);
  const path = `./public/${timestamp}_${image.name}`;
  await writeFile(path, buffer);
  const imgUrl = `/${timestamp}_${image.name}`;

  const blogData = {
    title: `${formData.get("title")}`,
    description: `${formData.get("description")}`,
    category: `${formData.get("category")}`,
    author: `${formData.get("author")}`,
    image: `${imgUrl}`,
  };
  await blogModel.create(blogData);

  return NextResponse.json({ success: true, msg: "blog added" });
}

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get("id");
  const blog = await blogModel.findById(id);
  fs.unlink(`./public${blog.image}`, () => {});
  await blogModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "blog deleted" });
}

import { connectDB } from "@/lib/config/db";
import blogModel from "@/lib/models/blogModel";
// ...existing code...
import cloudinary from "@/lib/config/cloudinary";
import multer from "multer";
import { Readable } from "stream";
import { promisify } from "util";
// ...existing code...
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/config/nodemailer";
import emailModel from "@/lib/models/emailModel";
import path from "path";

const loadDB = async () => {
  await connectDB();
};

// Validation helper functions
const validateBlogData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push("Title must be at least 3 characters long");
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters long");
  }

  if (!data.author || data.author.trim().length < 2) {
    errors.push("Author name must be at least 2 characters long");
  }

  if (
    !data.category ||
    !["Technology", "Startup", "Lifestyle"].includes(data.category)
  ) {
    errors.push("Category must be one of: Technology, Startup, Lifestyle");
  }

  return errors;
};

const validateImageFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return "Only JPEG, PNG, and WebP images are allowed";
  }

  if (file.size > maxSize) {
    return "Image size must be less than 5MB";
  }

  return null;
};

loadDB();

export async function GET(request) {
  try {
    const blogId = request.nextUrl.searchParams.get("id");

    if (blogId) {
      // Validate ObjectId format
      if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json(
          { success: false, error: "Invalid blog ID format" },
          { status: 400 }
        );
      }

      const blog = await blogModel.findById(blogId);
      if (!blog) {
        return NextResponse.json(
          { success: false, error: "Blog not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, blog });
    } else {
      const blogs = await blogModel.find({}).sort({ date: -1 });
      return NextResponse.json({ success: true, blogs });
    }
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
// Helper to convert a web stream to a buffer
async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(request) {
  // Check admin authentication for POST requests
  const adminAuth = request.headers.get("x-admin-auth");
  if (adminAuth !== "authenticated") {
    return NextResponse.json(
      { success: false, error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    // Extract and validate data
    const blogData = {
      title: formData.get("title")?.toString().trim(),
      description: formData.get("description")?.toString().trim(),
      category: formData.get("category")?.toString().trim(),
      author: formData.get("author")?.toString().trim(),
    };
    const image = formData.get("image");

    // Validate blog data
    const validationErrors = validateBlogData(blogData);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      );
    }

    // Validate image
    if (!image || !image.name) {
      return NextResponse.json(
        { success: false, error: "Image is required" },
        { status: 400 }
      );
    }

    // Convert image to buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer());

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "samblog" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      Readable.from(imageBuffer).pipe(uploadStream);
    });

    // Create blog with Cloudinary image URL
    const newBlog = await blogModel.create({
      ...blogData,
      image: uploadResult.secure_url,
    });

    // Send email to all subscribers
    try {
      const subscribers = await emailModel.find({});
      if (subscribers.length > 0) {
        const to = subscribers.map((s) => s.email).join(",");
        await sendMail({
          to,
          subject: `New Blog Published: ${newBlog.title}`,
          html: `<h2>${newBlog.title}</h2><p>${
            newBlog.description
          }</p><a href="${
            process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"
          }/blogs/${newBlog._id}">Read more</a>`,
        });
      }
    } catch (err) {
      console.error("Failed to send blog alert email:", err.message);
    }

    return NextResponse.json({
      success: true,
      msg: "Blog added successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  // Check admin authentication for DELETE requests
  const adminAuth = request.headers.get("x-admin-auth");
  if (adminAuth !== "authenticated") {
    return NextResponse.json(
      { success: false, error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const id = request.nextUrl.searchParams.get("id");

    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    const blog = await blogModel.findById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Delete image file if it exists
    if (blog.image) {
      const imagePath = `./public${blog.image}`;
      try {
        await fs.promises.unlink(imagePath);
      } catch (error) {
        console.warn("Failed to delete image file:", error.message);
      }
    }

    await blogModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      msg: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/blog error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  // Check admin authentication for PATCH requests (clear database)
  const adminAuth = request.headers.get("x-admin-auth");
  if (adminAuth !== "authenticated") {
    return NextResponse.json(
      { success: false, error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const action = request.nextUrl.searchParams.get("action");

    if (action === "clear") {
      // Delete all blogs
      const result = await blogModel.deleteMany({});

      return NextResponse.json({
        success: true,
        msg: `Database cleared successfully. Deleted ${result.deletedCount} blogs.`,
        deletedCount: result.deletedCount,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action. Use ?action=clear" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("PATCH /api/blog error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear database" },
      { status: 500 }
    );
  }
}

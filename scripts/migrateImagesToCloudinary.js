import dotenv from "dotenv";
dotenv.config();
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);
import mongoose from "mongoose";
import blogModel from "../lib/models/blogModel.js";
import fs from "fs";

// Import and configure Cloudinary after dotenv
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrateImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  const blogs = await blogModel.find({});
  let migrated = 0;
  for (const blog of blogs) {
    if (blog.image && !blog.image.startsWith("http")) {
      const localPath = `./public${blog.image}`;
      if (fs.existsSync(localPath)) {
        try {
          const result = await cloudinary.uploader.upload(localPath, {
            folder: "samblog",
          });
          blog.image = result.secure_url;
          await blog.save();
          migrated++;
          console.log(`Migrated: ${blog.title}`);
        } catch (err) {
          console.error(`Failed to migrate ${blog.title}`);
          console.error(`  Local path: ${localPath}`);
          console.error(`  Error:`, err);
        }
      } else {
        console.warn(
          `File not found for blog: ${blog.title} | Expected: ${localPath}`
        );
      }
    }
  }
  console.log(`Migration complete. Migrated ${migrated} images.`);
  // Print all blog titles and their image URLs for verification
  const updatedBlogs = await blogModel.find({});
  console.log("\n--- Blog Images After Migration ---");
  updatedBlogs.forEach((blog) => {
    console.log(`${blog.title}: ${blog.image}`);
  });
  process.exit(0);
}

migrateImages();

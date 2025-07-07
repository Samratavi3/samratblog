import { connectDB } from "../lib/config/db.js";
import blogModel from "../lib/models/blogModel.js";
import blogData from "./blogData.js";

const populateBlogs = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Clearing existing blogs...");
    await blogModel.deleteMany({});

    console.log("Adding 100 sample blogs...");
    const blogs = await blogModel.insertMany(blogData);

    console.log(`Successfully added ${blogs.length} blogs to the database!`);

    // Count blogs by category
    const techCount = await blogModel.countDocuments({
      category: "Technology",
    });
    const startupCount = await blogModel.countDocuments({
      category: "Startup",
    });
    const lifestyleCount = await blogModel.countDocuments({
      category: "Lifestyle",
    });

    console.log(`Technology blogs: ${techCount}`);
    console.log(`Startup blogs: ${startupCount}`);
    console.log(`Lifestyle blogs: ${lifestyleCount}`);
    console.log(`Total blogs: ${techCount + startupCount + lifestyleCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Error populating blogs:", error);
    process.exit(1);
  }
};

populateBlogs();

import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://samratavi94:blog@blog.hqhkvid.mongodb.net/blog"
  );
  console.log("DB conneted");
};

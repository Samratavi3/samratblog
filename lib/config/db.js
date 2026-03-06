import mongoose from "mongoose";

// Connection retry configuration
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

// Configure mongoose connection options
mongoose.set("strictQuery", false);

// Setup connection event listeners
const setupConnectionListeners = () => {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected successfully");
  });

  mongoose.connection.on("close", () => {
    console.log("🔌 MongoDB connection closed");
  });
};

// Connect to database with retry logic
export const connectDB = async (retryCount = 0) => {
  const options = {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds socket timeout
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 10000,
    retryWrites: true,
    retryReads: true,
    autoIndex: true,
  };

  try {
    // Setup listeners before connecting
    if (retryCount === 0) {
      setupConnectionListeners();
    }

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log("DB connected successfully");
  } catch (error) {
    console.error(
      `Database connection error (attempt ${retryCount + 1}/${MAX_RETRIES}):`,
      error.message,
    );

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return connectDB(retryCount + 1);
    } else {
      console.error("❌ Max retries reached. Could not connect to database.");
      throw error;
    }
  }
};

// Ping database to keep connection alive
export const pingDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      console.log("🏓 Database ping successful -", new Date().toISOString());
      return true;
    } else {
      console.warn("⚠️ Database not connected. Attempting to reconnect...");
      await connectDB();
      return false;
    }
  } catch (error) {
    console.error("❌ Database ping failed:", error.message);
    // Attempt to reconnect if ping fails
    try {
      await connectDB();
    } catch (reconnectError) {
      console.error("❌ Reconnection failed:", reconnectError.message);
    }
    return false;
  }
};

// Graceful shutdown
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("Database connection closed gracefully");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
};

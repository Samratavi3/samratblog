const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const cron = require("node-cron");

// Import database functions
// Note: We need to use dynamic import for ES modules
let connectDB, pingDB, disconnectDB;

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT, 10) || 3000;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Initialize database functions
async function initializeDB() {
  try {
    const dbModule = await import("./lib/config/db.js");
    connectDB = dbModule.connectDB;
    pingDB = dbModule.pingDB;
    disconnectDB = dbModule.disconnectDB;

    // Connect to database on startup
    await connectDB();
    console.log("✅ Initial database connection established");

    // Setup cron job to ping database every 24 hours
    // Runs at 3:00 AM every day
    cron.schedule("0 3 * * *", async () => {
      console.log("🕐 Running scheduled database ping...");
      await pingDB();
    });

    // Additional ping every 12 hours for extra safety
    cron.schedule("0 */12 * * *", async () => {
      console.log("🕐 Running 12-hour database ping...");
      await pingDB();
    });

    console.log("✅ Database ping cron jobs scheduled");
    console.log("   - Daily ping: 3:00 AM");
    console.log("   - 12-hour ping: Every 12 hours");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    // Don't crash the server, just log the error
  }
}

// Prepare Next.js app and start server
app.prepare().then(async () => {
  // Initialize database
  await initializeDB();

  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  });

  // Graceful shutdown handlers
  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    // Close server first
    server.close(async () => {
      console.log("✅ HTTP server closed");

      // Close database connection
      if (disconnectDB) {
        await disconnectDB();
      }

      console.log("✅ Graceful shutdown completed");
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error("⚠️ Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  // Listen for termination signals
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  // Handle uncaught errors
  process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  });

  process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
    gracefulShutdown("uncaughtException");
  });

  // Start listening
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`\n🚀 Server ready on http://${hostname}:${port}`);
    console.log(`   - Environment: ${dev ? "development" : "production"}`);
    console.log(`   - Node version: ${process.version}`);
  });
});

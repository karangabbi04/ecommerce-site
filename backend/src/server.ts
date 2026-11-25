import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { connectDB } from "./db/index.js";
import { logger } from "./config/logger.js";
import { cleanupExpiredCheckoutSessions } from "./services/checkout.service.js";

const PORT = Number(process.env.PORT) || 8000;
const CHECKOUT_CLEANUP_INTERVAL_MS = 60_000;
let checkoutCleanupRunning = false;

const runCheckoutCleanup = async () => {
  if (checkoutCleanupRunning) return;

  checkoutCleanupRunning = true;
  try {
    const deletedCount = await cleanupExpiredCheckoutSessions();
    if (deletedCount > 0) {
      logger.info({ deletedCount }, "Expired checkout sessions cleaned up");
    }
  } catch (error) {
    logger.error(error, "Expired checkout cleanup failed");
  } finally {
    checkoutCleanupRunning = false;
  }
};

process.on("uncaughtException", (error) => {
  logger.fatal(error, "Uncaught Exception");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.fatal(reason, "Unhandled Promise Rejection");
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    void runCheckoutCleanup();
    const checkoutCleanupTimer = setInterval(
      () => void runCheckoutCleanup(),
      CHECKOUT_CLEANUP_INTERVAL_MS,
    );
    checkoutCleanupTimer.unref();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.fatal(error, "Failed to start server");
    process.exit(1);
  }
};

startServer();
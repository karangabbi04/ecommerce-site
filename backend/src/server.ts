import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { connectDB } from "./db/index.js";
import { logger } from "./config/logger.js";

const PORT = Number(process.env.PORT) || 8000;

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

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.fatal(error, "Failed to start server");
    process.exit(1);
  }
};

startServer();
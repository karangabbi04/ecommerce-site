"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_js_1 = __importDefault(require("./app.js"));
const index_js_1 = require("./db/index.js");
const logger_js_1 = require("./config/logger.js");
const PORT = Number(process.env.PORT) || 8000;
process.on("uncaughtException", (error) => {
    logger_js_1.logger.fatal(error, "Uncaught Exception");
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    logger_js_1.logger.fatal(reason, "Unhandled Promise Rejection");
    process.exit(1);
});
const startServer = async () => {
    try {
        await (0, index_js_1.connectDB)();
        app_js_1.default.listen(PORT, () => {
            logger_js_1.logger.info(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        logger_js_1.logger.fatal(error, "Failed to start server");
        process.exit(1);
    }
};
startServer();

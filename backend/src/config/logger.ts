import pino, { LoggerOptions } from "pino";

const isProduction = process.env.NODE_ENV === "production";

const options: LoggerOptions = {
  level: process.env.LOG_LEVEL || "info",

  timestamp: pino.stdTimeFunctions.isoTime,

  base: undefined,

  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
};

export const logger = pino(options);
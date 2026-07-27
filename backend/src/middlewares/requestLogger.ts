import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",

          options: {
            colorize: true,

            // Better readable timestamp
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss",

            // Remove unnecessary fields
            ignore: "pid,hostname",

            // Keep multiline messages readable
            singleLine: false,
          },
        }
      : undefined,

  // Production error formatting
  serializers: {
    err: pino.stdSerializers.err,
  },
});
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "ACCESS_TOKEN_EXPIRES_IN",
  "REFRESH_TOKEN_EXPIRES_IN",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 8000,
  nodeEnv: process.env.NODE_ENV || "development",

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,

  jwtAccessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  jwtRefreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,


};
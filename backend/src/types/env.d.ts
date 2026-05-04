declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: "development" | "production" | "test";

    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;

    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;

    RESEND_API_KEY: string;
    EMAIL_FORM: string;
    OTP_EXPIRES_IN: string;
    OTP_SECRET: string;
  }
}
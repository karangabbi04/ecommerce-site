declare namespace NodeJS {
  interface ProcessEnv {
    RAZORPAY_SECRET: string | undefined;
    PORT?: string;
    NODE_ENV?: "development" | "production" | "test";
    DATABASE_URL: string;

    GEMINI_API_KEY: string;

    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;

    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;

    RESEND_API_KEY: string;
    EMAIL_FORM: string;
    OTP_EXPIRES_IN: string;
    OTP_SECRET: string;
    GST_RATE: number;
    CHECKOUT_EXPIRY_MINUTES: number;
    REDIS_URL: string;
    RAZORPAY_KEY_SECRET:string;
    RAZORPAY_KEY_ID: string;
  }
}
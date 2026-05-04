import crypto from "crypto";

const OTP_SECRET: string = (process.env.OTP_SECRET as string) || "";

if (!OTP_SECRET) {
  throw new Error("OTP_SECRET is not defined in environment variables");
}

export function generateOTP(length: number = 6): string {

    return crypto.randomInt(100000,1000000).toString();
}

export function hashOTP(otp: string): string {
    const hash = crypto
    .createHmac("sha256", OTP_SECRET)
    .update(otp)
    .digest("hex");
    return hash;
}

export function verifyOTP(otp: string, hashedOTP: string): boolean {
    const hash = hashOTP(otp);
    return hash === hashedOTP;
}

export function getOTPExpiryTime(): number {
    const expiresIn = process.env.OTP_EXPIRES_IN || "300"; // default to 5 minutes
    return Date.now() + parseInt(expiresIn as string) * 1000;
}
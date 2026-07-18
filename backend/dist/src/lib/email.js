"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = sendOTPEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendOTPEmail({ to, otp, }) {
    const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FORM,
        to,
        subject: "Verify your email",
        html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Email Verification</h2>
        <p>Your signup OTP is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
    });
    if (error) {
        console.error("Resend email error:", error);
        throw new Error("Failed to send OTP email");
    }
    if (!error) {
        console.log("Email sent successfully:", data);
    }
    console.log("Email sent successfully:", data);
    return data;
}

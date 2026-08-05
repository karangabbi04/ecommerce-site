import crypto from "crypto";


export function verifyRazorpayWebhook(
    body:Buffer,
    signature:string
){


const generatedSignature =
crypto
.createHmac(
    "sha256",
    process.env.RAZORPAY_WEBHOOK_SECRET!
)
.update(body)
.digest("hex");



return generatedSignature === signature;


}
import Router from "express";
import {verifySignupOTP} from "../controllers/verifyOtp.controller";
import {requestSignupOTP} from "../controllers/otp-request.controller";

const router = Router();

router.post("/request-signup-otp", requestSignupOTP);
router.post("/verify-signup-otp", verifySignupOTP);

export default router;
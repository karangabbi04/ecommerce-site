import Router from "express";
// import {verifySignupOTP} from "../controllers/otp.controller";
import {requestSignupOTP} from "../controllers/otp.controller";

const router = Router();

router.post("/request-signup-otp", requestSignupOTP);
// router.post("/verify-signup-otp", verifySignupOTP);

export default router;
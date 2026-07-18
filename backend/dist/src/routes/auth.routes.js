"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import {verifySignupOTP} from "../controllers/otp.controller";
const otp_controller_1 = require("../controllers/otp.controller");
const router = (0, express_1.default)();
router.post("/request-signup-otp", otp_controller_1.requestSignupOTP);
// router.post("/verify-signup-otp", verifySignupOTP);
exports.default = router;

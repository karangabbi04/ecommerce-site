"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP_REQUEST_INTERVAL = exports.OtpPurpose = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "OtpPurpose", { enumerable: true, get: function () { return client_1.OtpPurpose; } });
// export enum OTPPurpose {
//   SIGNUP = "SIGNUP",
//   LOGIN = "LOGIN",
//   RESET_PASSWORD = "RESET_PASSWORD",
//   CHANGE_EMAIL = "CHANGE_EMAIL",
//   ORDER_VERIFICATION = "ORDER_VERIFICATION",
// }
exports.OTP_REQUEST_INTERVAL = 60 * 1000; // 1 minute

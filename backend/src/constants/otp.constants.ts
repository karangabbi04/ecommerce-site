    import { OtpPurpose } from "@prisma/client";

    export {OtpPurpose} ;

// export enum OTPPurpose {
//   SIGNUP = "SIGNUP",
//   LOGIN = "LOGIN",
//   RESET_PASSWORD = "RESET_PASSWORD",
//   CHANGE_EMAIL = "CHANGE_EMAIL",
//   ORDER_VERIFICATION = "ORDER_VERIFICATION",
// }

export const OTP_REQUEST_INTERVAL = 60 * 1000; // 1 minute
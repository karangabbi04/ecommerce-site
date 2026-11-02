import { Router } from "express";
import {
	registerUser,
	loginUser,
	getCurrentUser,
	verifyUserUsingOtp,
	loginverify,
	refreshUserAccessToken,
	logoutUserController,
	checkUserExist,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me",verifyJWT,getCurrentUser)
router.get("/check-access",checkUserExist)
router.post("/verifyOtp",verifyUserUsingOtp)
router.post("/loginVerify",loginverify)
router.post("/refresh", refreshUserAccessToken)
router.post("/logout", logoutUserController)

export default router
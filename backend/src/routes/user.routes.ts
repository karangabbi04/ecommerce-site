import { Router } from "express";
import { registerUser,loginUser,getCurrentUser,verifyUserUsingOtp } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me",verifyJWT,getCurrentUser)
router.post("/verifyOtp",verifyUserUsingOtp)

export default router;
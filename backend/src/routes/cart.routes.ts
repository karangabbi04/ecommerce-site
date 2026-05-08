import Router from "express";
import { optionalAuth } from "../middlewares/verifyJWT.middleware";
import { addToCart } from "../controllers/cart.controller";


const router = Router();

router.post("/items",optionalAuth,addToCart)



export default router;
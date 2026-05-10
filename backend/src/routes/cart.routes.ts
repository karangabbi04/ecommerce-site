import Router from "express";
import { optionalAuth } from "../middlewares/verifyJWT.middleware";
import { addToCart, getCart } from "../controllers/cart.controller";
import { get } from "node:http";


const router = Router();

router.post("/items",optionalAuth,addToCart)
router.get("/add-cart",optionalAuth,getCart)



export default router;
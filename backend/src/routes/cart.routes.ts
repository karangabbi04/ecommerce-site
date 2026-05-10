import Router from "express";
import { optionalAuth } from "../middlewares/verifyJWT.middleware";
import { addToCart, getCart,updateCartItemQuantity } from "../controllers/cart.controller";
import { get } from "node:http";


const router = Router();

router.post("/items",optionalAuth,addToCart)
router.get("/get-cart",optionalAuth,getCart)
router.patch("/items/:itemId",optionalAuth,updateCartItemQuantity)



export default router;
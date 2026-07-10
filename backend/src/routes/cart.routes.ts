import Router from "express";
import { optionalAuth } from "../middlewares/verifyJWT.middleware";
import { addToCart, getCart,updateCartItemQuantity , deleteCartItem} from "../controllers/cart.controller";
import { get } from "node:http";


const router = Router();

router.post("/items",optionalAuth,addToCart)
router.get("/get-cart",optionalAuth,getCart)
router.patch("/items/:productId",optionalAuth,updateCartItemQuantity)
router.delete("/items/:itemId",optionalAuth,deleteCartItem)




export default router;
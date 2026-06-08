import { Router } from "express";

import { createAddress,getAddress,attachAddress } from "../controllers/address.controller";

const router = Router();


router.post( "/",createAddress);

router.get("/", getAddress );

router.post( "/checkout/:checkoutId", attachAddress );

export default router;
import { Router } from "express";

import { createAddress,getAddress,getAddressSuggestions,getcurrentLocation,attachAddress} from "../controllers/address.controller";

const router = Router();


router.post( "/",createAddress);

router.get("/", getAddress );

router.post( "/address/:checkoutId", attachAddress );

router.get("/search",getAddressSuggestions)
router.get("/location",getcurrentLocation)

export default router;
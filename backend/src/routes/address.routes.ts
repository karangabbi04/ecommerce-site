import { Router } from "express";

import { createAddress,getAddress,attachAddress,getAddressSuggestions,getcurrentLocation} from "../controllers/address.controller";

const router = Router();


router.post( "/",createAddress);

router.get("/", getAddress );

router.post( "/checkout/:checkoutId", attachAddress );

router.get("/search",getAddressSuggestions)
router.get("/location",getcurrentLocation)

export default router;
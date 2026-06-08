import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { createAddressService,getAddresses,attachAddressToCheckout } from "../services/address.service";
import { createAddressSchema } from "../validations/address.schema";
import { ApiError } from "../utils/ApiError";
import { string } from "zod";



export const createAddress = asyncHandler( async (req:Request, res:Response)=>{


     const parsed = createAddressSchema.parse(req.body);
     const userId = req.user?.id;
    const guestId = req.cookies.guest_cart_id;



    if(!userId && !guestId ){
       throw new ApiError(400, "User with this email already exists");
   }

    const address = await createAddressService({
  userId,
  guestId,
  data: parsed,
});

    res.status(201).json(
      new ApiResponse(201, address, "Address created successfully")
    );

})


export const getAddress = asyncHandler(async(req:Request, res:Response)=>{

          const parsed = createAddressSchema.parse(req.body);
     const userId = req.user?.id;
    const guestId = req.cookies.guest_cart_id;



    if(!userId && !guestId ){
       throw new ApiError(400, "User with this email already exists");
   }

    const addresses = await getAddresses(
  userId,
  guestId,
);

    res.status(201).json(
      new ApiResponse(201, addresses, "Address created successfully")
    );
    
})



export const attachAddress = asyncHandler(async(req:Request, res:Response)=>{

    const checkoutId = req.params.checkoutId;

   const { addressId, } = req.body;


  

    const checkout = await attachAddressToCheckout(
    checkoutId as string,
     addressId
);

    res.status(201).json(
      new ApiResponse(201, checkout, "Address created successfully")
    );
    
})
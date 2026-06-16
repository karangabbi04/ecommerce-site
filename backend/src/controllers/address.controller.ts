import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { createAddressService,getAddresses,attachAddressToCheckout } from "../services/address.service";
import { createAddressSchema } from "../validations/address.schema";
import { ApiError } from "../utils/ApiError";
import { searchAddress } from "../provider/photon.provider";
import z from "zod";


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


const searchAddressSchema = z.object({
  q: z
    .string()
    .trim()
    .min(2, "minimum 2 characters required")
    .max(100, "query too long"),
});


export const getAddressSuggestions = asyncHandler(async (req: Request, res: Response) => {

  const validation = searchAddressSchema.safeParse(req.query);

  if (!validation.success) {
    throw new ApiError(400, validation.error.message);
  }

  const { q } = validation.data;

  if (q.trim().length < 3) {
    return res.status(200).json(new ApiResponse(200, "enter more letters"));
  }

  const suggestions = await searchAddress(q);

  if (!suggestions) {
    throw new ApiError(400, "some issue in suggestion");
  }

  res.status(200).json(new ApiResponse(200, suggestions, "suggestion successful"));
});



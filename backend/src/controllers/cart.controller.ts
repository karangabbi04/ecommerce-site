import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
 import { addToCartSchema, updateCartItemSchema ,removeCartItemSchema } from "../validations/cart.validation.js";
 import { cartService } from "../services/cart.service.js";
 import { CART_MESSAGES } from "../constants/cart.constants.js";
import { it } from "node:test";

 
export const addToCart = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedBody = addToCartSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new ApiError(
        400,
        parsedBody.error.issues[0]?.message || "Invalid cart data"
      );
    }

    const cart = await cartService.addToCart({
      dto: parsedBody.data,
      userId: req.user?.id,
      guestId: req.cookies?.guest_cart_id,
      res,
    });

     res.status(200).json(
      new ApiResponse(
        200,
        cart,
        CART_MESSAGES.ITEM_ADDED
      )
    );
  }
);

export const getCart = asyncHandler(
  async (req: Request, res: Response) => {
    const cart = await cartService.getCart({
      userId: req.user?.id,
      guestId: req.cookies?.guest_cart_id,
      res,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        cart,
        CART_MESSAGES.CART_FETCHED
      )
    );
  }
);

export const deleteCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.params)
    const itemId = Array.isArray(req.params.itemId)
      ? req.params.itemId[0]
      : req.params.itemId;

    if (!itemId) {
      throw new ApiError(400, "itemId ID is required");
    }

    const cart = await cartService.removeCartItem({
      itemId,
      userId: req.user?.id,
      guestId: req.cookies?.guest_cart_id,
      res,
    });

    res.status(200).json(new ApiResponse(200, cart, CART_MESSAGES.ITEM_REMOVED));
  }

);


export const updateCartItemQuantity = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedBody =
      updateCartItemSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new ApiError(
        400,
        parsedBody.error.issues[0]?.message ||
          "Invalid request"
      );
    }

    const productId = Array.isArray(req.params.productId)
      ? req.params.productId[0]
      : req.params.productId;

    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }

    const cart = await cartService.updateCartItemQuantity({
      productId,
      quantity: parsedBody.data.quantity,
      userId: req.user?.id,
      guestId: req.cookies?.guest_cart_id,
    });

     res.status(200).json(
      new ApiResponse(
        200,
        cart,
        CART_MESSAGES.ITEM_UPDATED
      )
    );
  }
);
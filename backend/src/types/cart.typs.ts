import { z } from "zod";

import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../validations/cart.validation";

import { Response } from "express";

export type AddToCartDto = z.infer<typeof addToCartSchema>;

export type UpdateCartItemDto = z.infer<
  typeof updateCartItemSchema
>;

export type RemoveCartItemDto = z.infer<
  typeof removeCartItemSchema
>;

export interface CartContext {
  userId?: string;
  guestId?: string;
  res: Response;
}
import { Prisma } from "@prisma/client";

import { ApiError } from "../utils/apiError.js";

import { prisma } from "../lib/prisma.js";

import { checkoutRepository } from "../repositories/checkout.repository.js";
import * as addressRepository from "../repositories/address.repository.js";

import {
  GST_RATE,
  CHECKOUT_EXPIRY_MINUTES,
} from "../constants/checkout.constants.js";

import {
  calculateShipping,
  calculateTax,
  calculateTotal,
//   getCheckoutExpiry,
} from "../utils/checkout.utils.js";
import { check, iso } from "zod";
import { logger } from "../config/logger.js";

type CheckoutInput = {
  userId?: string;
  guestId?: string;
};

export const createCheckoutSession = async (
  input: CheckoutInput
) => {
  // Validate Input
  if (!input.userId && !input.guestId) {
    throw new ApiError(400, "User or Guest id is required.");
  }

  // Reuse existing active checkout
  const existingCheckout =
    await checkoutRepository.findPendingCheckout(
      input.userId,
      input.guestId
    );

  if (existingCheckout) {
    return existingCheckout;
  }

  // Find Cart
  const cart = await checkoutRepository.findCart(
    input.userId,
    input.guestId
  );

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty.");
  }

  let subtotal = 0;

  const checkoutItems = cart.items.map((item) => {
    const { product } = item;

    if (product.stock <= 0) {
      throw new ApiError(
        400,
        `${product.name} is currently out of stock.`
      );
    }

    if (item.quantity > product.stock) {
      throw new ApiError(
        400,
        `${product.name} has only ${product.stock} items available.`
      );
    }

    const itemTotal =
      Number(product.price) * item.quantity;

    subtotal += itemTotal;

    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
    };
  });

  const shipping = calculateShipping(subtotal);

  const tax = calculateTax(subtotal, GST_RATE);

  const total = calculateTotal(
    subtotal,
    shipping,
    tax
  );

  const session = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const checkoutSession =
        await checkoutRepository.createCheckoutSession(
          tx,
          {
            userId: input.userId,
            guestId: input.guestId,
            subtotal,
            shipping,
            tax,
            total,
            expiresAt: new Date(Date.now() + CHECKOUT_EXPIRY_MINUTES * 60 * 1000)
          }
        );console.log(checkoutSession);

      await checkoutRepository.createCheckoutItems(
        tx,
        checkoutItems.map((item) => ({
          checkoutSessionId: checkoutSession.id,
          ...item,
        }))
      );
            const completeSession =
        await checkoutRepository.findCheckoutById(
            tx,
          checkoutSession.id
        );
        console.log(completeSession);

      if (!completeSession) {
        throw new ApiError(
          500,
          "Failed to create checkout session."
        );
      }

      return completeSession;
    }
  );

  return session;
};

export const fetchCheckoutSession = async (

  checkoutId: string
) => {
  if (!checkoutId) {
    throw new ApiError(
      400,
      "Checkout session id is required."
    );
  }

  const checkout =
    await checkoutRepository.findCheckoutById(
        prisma,
      checkoutId
    );

  if (!checkout) {
    throw new ApiError(
      404,
      "Checkout session not found."
    );
  }

  if (
    checkout.status === "ACTIVE" &&
    checkout.expiresAt < new Date()
  ) {
    await prisma.checkoutSession.update({
      where: {
        id: checkout.id,
      },
      data: {
        status: "EXPIRED",
      },
    });

    throw new ApiError(
      410,
      "Checkout session has expired."
    );
  }

  return checkout;

};
    
  export const  attachAddressToCheckout = async(
    checkoutId: string,
    addressId: string,
    userId?: string,
    guestId?: string
  ) => {
    const checkout =
      await checkoutRepository.findCheckoutById(prisma,checkoutId);

    if (!checkout) {
      throw new Error("Checkout not found");
    }

  

    const address =
      await addressRepository.findById(addressId);


    if (!address) {
      throw new Error("Address not found");
    }


    console.log(address.guestId,address.userId)
    const isOwner =
      (userId && address.userId === userId) ||
      (guestId && address.guestId === guestId);
      
      console.log(isOwner,"kjalkfjakfajkj afa")

    if (!isOwner) {
      throw new Error(
        "You are not allowed to use this address."
      );
    }

    return checkoutRepository.updateAddress(
      checkoutId,
      addressId
    );
  }

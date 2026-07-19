import { Response ,Request,CookieOptions} from "express";
import crypto from "crypto";
import { Cart } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "./asyncHandler.js";
import { ApiError } from "./apiError.js";

const GUEST_CART_COOKIE_NAME = "guest_cart_id";
const GUEST_CART_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

const guestCartCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
  maxAge: GUEST_CART_MAX_AGE,
};

const GUEST_ID_REGEX =
  /^guest_[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type GetOrCreateCartParams = {
  userId?: string | null;
  guestId?: string | null;
  res: Response;
};

const createGuestId = () => `guest_${crypto.randomUUID()}`;

const isValidGuestId = (guestId?: string | null): guestId is string => {
  return Boolean(guestId && GUEST_ID_REGEX.test(guestId));
};

export const getOrCreateCart = async ({
  userId,
  guestId,
  res,
}: GetOrCreateCartParams): Promise<Cart> => {
  if (userId) {
    return prisma.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });
  }

  let finalGuestId = guestId;

  if (!isValidGuestId(finalGuestId)) {
    finalGuestId = createGuestId();

    res.cookie(
      GUEST_CART_COOKIE_NAME,
      finalGuestId,
      guestCartCookieOptions
    );
  }

  return prisma.cart.upsert({
    where: {
      guestId: finalGuestId,
    },
    update: {},
    create: {
      guestId: finalGuestId,
    },
  });
};
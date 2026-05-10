
import { Request, Response, urlencoded } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { hashPassword, comparePassword } from "../utils/password";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";
import z from "zod";
import { getOrCreateCart } from "../utils/getOrCreateCart";


const addToCartSchema = z.object({
  productId: z.string().min(1, "Product id is required"),
  quantity: z.coerce.number().int().positive().default(1),
});

const cartWithItemsInclude = {
  id: true,
  userId: true,
  guestId: true,
  createdAt: true,
  updatedAt: true,

  items: {
    select: {
      id: true,
      quantity: true,

      product: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          isFeatured: true,

          images: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CartSelect;


export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const parsedBody = addToCartSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new ApiError(
      400,
      parsedBody.error.issues[0]?.message || "Invalid cart data"
    );
  }

  const { productId, quantity } = parsedBody.data;

  const cart = await getOrCreateCart({
    userId: req.user?.id,
    guestId: req.cookies?.guest_cart_id,
    res,
  });

  const updatedCart = await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        stock: true,
        isFeatured: true,
      },
    });

     if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (!product.isFeatured) {
      throw new ApiError(400, "Product is not available");
    }

     const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    const nextQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (nextQuantity > product.stock) {
      throw new ApiError(400, "Cart quantity exceeds available stock");
    }

    await tx.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: nextQuantity,
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    return tx.cart.findUnique({
      where: {
        id: cart.id,
      },
      select: cartWithItemsInclude,
    });
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCart, "Product added to cart"));

});

const emptyCartPayload = {
  cart: null,
  items: [],
  totalItems: 0,
  subtotal: 0,
};

const cartInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          stock: true,
          isFeatured: true,
          images: {
            select: {
              id: true,
              url: true,
            },
            orderBy: {
              createdAt: "asc",
            },
            take: 1, // Cart page ke liye usually ek thumbnail enough hota hai
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  },
} satisfies Prisma.CartInclude;

const getCartWhereClause = ({
  userId,
  guestId,
}: {
  userId?: string;
  guestId?: string;
}): Prisma.CartWhereUniqueInput | null => {
  if (userId) {
    return { userId };
  }

  if (guestId) {
    return { guestId };
  }

  return null;
};

type CartWithItems = Prisma.CartGetPayload<{
  include: typeof cartInclude;
}>;

const calculateCartSummary = (cart: CartWithItems) => {
  const totalItems = cart.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const subtotal = cart.items.reduce((total, item) => {
    const productPrice = Number(item.product.price);
    return total + productPrice * item.quantity;
  }, 0);
  return {
    totalItems,
    subtotal,
  };
};

const formatCartResponse = (cart: CartWithItems) => {
  const { totalItems, subtotal } = calculateCartSummary(cart);

  const items = cart.items.map((item) => {
    const product = item.product;

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,

      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        stock: product.stock,
        isFeatured: product.isFeatured,
        thumbnail: product.images[0]?.url ?? null,
      },

      itemTotal: Number(product.price) * item.quantity,

      availability: {
        inStock: product.stock > 0,
        hasEnoughStock: product.stock >= item.quantity,
        isFeatured: product.isFeatured,
      },

      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });

  return {
    cart: {
      id: cart.id,
      userId: cart.userId,
      guestId: cart.guestId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    },
    items,
    totalItems,
    subtotal,
  };
};


export const getCart =asyncHandler(async(req:Request,res:Response)=>{

  const userId = req.user?.id;
  const guestId = req.cookies?.guest_cart_id;

  if (!userId && !guestId) {
    return res.status(200).json(
      new ApiResponse(200, emptyCartPayload, "Cart is empty")
    );
  }

  const cart = userId
    ? await prisma.cart.findUnique({
        where: {
          userId,
        },
        include: cartInclude,
      })
    : await prisma.cart.findUnique({
        where: {
          guestId,
        },
        include: cartInclude,
      });

  if (!cart) {
    return res.status(200).json(
      new ApiResponse(200, emptyCartPayload, "Cart is empty")
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      formatCartResponse(cart),
      "Cart fetched successfully"
    )
  );

});


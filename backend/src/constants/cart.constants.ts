export const CART_ERRORS = {
  CART_NOT_FOUND: "Cart not found",

  CART_ITEM_NOT_FOUND: "Cart item not found",

  UNAUTHORIZED_CART_ITEM: "You cannot modify this cart item",

  PRODUCT_NOT_FOUND: "Product not found",

  PRODUCT_UNAVAILABLE: "Product is not available",

  INVALID_QUANTITY: "Invalid quantity",

  OUT_OF_STOCK: "Product is out of stock",

  STOCK_EXCEEDED:
    "Requested quantity exceeds available stock",

  CART_EMPTY: "Cart is empty",
} as const;

export const CART_MESSAGES = {
  ITEM_ADDED: "Product added to cart",

  CART_FETCHED: "Cart fetched successfully",

  ITEM_UPDATED: "Cart updated successfully",

  ITEM_REMOVED: "Item removed from cart",

  CART_CLEARED: "Cart cleared successfully",
} as const;

export const CART_LIMITS = {
  MAX_ITEM_QUANTITY: 10,
} as const;
export const GST_RATE = Number(process.env.GST_RATE ?? 18);

export const SHIPPING_CHARGE = Number(
  process.env.SHIPPING_CHARGE ?? 100
);

export const FREE_SHIPPING_THRESHOLD = Number(
  process.env.FREE_SHIPPING_THRESHOLD ?? 1000
);

export const CHECKOUT_EXPIRY_MINUTES = Number(
  process.env.CHECKOUT_EXPIRY_MINUTES ?? 25
);
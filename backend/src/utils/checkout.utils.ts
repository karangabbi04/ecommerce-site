export const round = (value: number): number => {
  return Number(value.toFixed(2));
};

export const calculateShipping = (subtotal: number): number => {
  return subtotal >= 1000 ? 0 : 100;
};

export const calculateTax = (
  subtotal: number,
  gstRate: number
): number => {
  return round((subtotal * gstRate) / 100);
};

export const calculateTotal = (
  subtotal: number,
  shipping: number,
  tax: number
): number => {
  return round(subtotal + shipping + tax);
};
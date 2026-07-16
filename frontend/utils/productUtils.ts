

type ProductImage = {
  id?: string;
  url: string;
};

type Product = {
  price: number;
  oldPrice?: number | null;
  images?: ProductImage[];
};

export function getActiveImage(
  images: ProductImage[] = [],
  selectedIndex: number,
  fallback = "/placeholder.png"
): string {
  if (!images.length) return fallback;

  return images[selectedIndex]?.url ?? fallback;
}

export function calculateDiscount(
  price: number,
  oldPrice?: number | null
): number {
  if (!oldPrice || oldPrice <= price) {
    return 0;
  }

  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function isOnSale(
  price: number,
  oldPrice?: number | null
): boolean {
  return calculateDiscount(price, oldPrice) > 0;
}

export function hasMultipleImages(images: ProductImage[] = []): boolean {
  return images.length > 1;
}


export function clampImageIndex(
  index: number,
  totalImages: number
): number {
  if (totalImages <= 0) return 0;

  return Math.min(Math.max(index, 0), totalImages - 1);
}

export const ProductUtils = {
  getActiveImage,
  calculateDiscount,
  isOnSale,
  hasMultipleImages,
  clampImageIndex,
};

export type { Product, ProductImage };
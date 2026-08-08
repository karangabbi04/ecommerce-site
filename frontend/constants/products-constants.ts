export const PRODUCT_CATEGORIES = [

  "All",
  "Glassware",
  "Decor",
  "Lighting",
  "Tableware",
] as const;

export const SORT_OPTIONS = [
  {
    label: "Featured",
    value: "featured",
  },
  {
    label: "Price : Low to High",
    value: "price_asc",
  },
  {
    label: "Price : High to Low",
    value: "price_desc",
  },
] as const;

export const DEFAULT_LIMIT = 10;
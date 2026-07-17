export const PRODUCT_CATEGORIES = [
  "newest",
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
    value: "low-high",
  },
  {
    label: "Price : High to Low",
    value: "high-low",
  },
] as const;

export const DEFAULT_LIMIT = 10;
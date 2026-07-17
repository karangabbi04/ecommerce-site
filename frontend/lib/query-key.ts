export const queryKeys = {
  products: ({
    page,
    limit,
    search,
    category,
    sort,
  }: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    sort?: string;
  }) => ["products", { page, limit, search, category, sort }] as const,

  product: (id: number) =>
    ["product", id] as const,
};
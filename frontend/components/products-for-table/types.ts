export type ProductStatus = "available" | "low" | "out";

export interface Product {
  id: number;
  image: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  sold: number;
  status: ProductStatus;
}
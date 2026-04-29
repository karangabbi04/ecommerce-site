export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image?: string;
  stock: number;
  category?: string;
  createdAt?: string;
}
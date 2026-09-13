export interface ProductImage {
  id?: number;
  url: string;
}

export interface Product {
  tag: string;
  id: number;
  name: string;
  description: string;
  category: string;

  price: number;
  oldPrice?: number;

  images: ProductImage[];
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;

  limit: number;

  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductResponse {
  products: Product[];

  pagination: Pagination;
}


   export interface ProductsParams {
  page: number;
  limit: number;
  search?:string;
  sort?:string;
  category?:string;


  
}

export interface Product {

  name: string;

  description: string;

  category: string;


  price: number;

  stock: number;

  createdAt: string;
}


export interface CreateProductPayload {

  name: string;

  description: string;

  category: string;

  images: string[];

  price: number;

  stock: number;

}
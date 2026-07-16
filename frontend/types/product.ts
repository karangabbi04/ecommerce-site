export interface ProductImage {
  id?: number;
  url: string;
}

export interface Product {
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
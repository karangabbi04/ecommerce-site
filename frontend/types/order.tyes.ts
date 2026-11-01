export type OrderStatus = 'all' | 'packed' | 'confirmed' | 'delivered' | 'cancelled';
export type DateFilterType = 'all' | 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';

export interface OrderFilters {
  status: OrderStatus;
  dateType: DateFilterType;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  page: number;
  limit: number;
}

export interface Order {
  id: string;
  customerName: string;
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
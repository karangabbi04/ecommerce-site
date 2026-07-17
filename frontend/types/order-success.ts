
export interface OrderSuccessAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderSuccessData {
  orderId: string;
  paymentId: string;
  amount: number;
  estimatedDelivery: string;
  address: OrderSuccessAddress;
}
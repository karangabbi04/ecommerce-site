export interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export type PaymentMethod = "online"  | "cod";

export interface PaymentMethodItem {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  image: string;
}

export interface PaymentMethodOption {
  id: PaymentMethod;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface PriceSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface PriceSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  className?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;

  variant?: string;
}

export interface OrderItemsProps {
  items: OrderItem[];
  className?: string;
}

export interface PaymentButtonProps {
  loading?: boolean;
  disabled?: boolean;
  amount: number;
  paymentMethod: PaymentMethod;
  onClick: () => void;
  className?: string;
}
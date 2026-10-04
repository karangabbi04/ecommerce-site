// src/types/tracking.ts

export type StepStatus = 'completed' | 'current' | 'pending';

export interface TrackingStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: StepStatus;
  icon: 'package' | 'box' | 'truck' | 'map-pin' | 'check-circle';
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface TrackingData {
  orderId: string;
  orderDate: string;
  expectedDelivery: string;
  currentStatus: string;
  steps: TrackingStep[];
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}
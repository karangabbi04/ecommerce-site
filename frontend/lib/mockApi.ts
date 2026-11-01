// src/lib/mockApi.ts
import { TrackingData } from "@/types/tracking.types";

export const fetchTrackingData = async (orderId: string): Promise<TrackingData> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (orderId.toLowerCase() !== "ord-12345") {
    throw new Error("Order ID not found. Please check and try again.");
  }

  return {
    orderId: "ORD-12345",
    orderDate: "2023-10-25",
    expectedDelivery: "2023-10-29",
    currentStatus: "Out for Delivery",
    steps: [
      { id: "1", title: "Order Placed", description: "Your order has been placed successfully.", timestamp: "Oct 25, 10:00 AM", status: "completed", icon: "package" },
      { id: "2", title: "Packed", description: "Your items are packed and ready to ship.", timestamp: "Oct 25, 02:30 PM", status: "completed", icon: "box" },
      { id: "3", title: "Shipped", description: "Package handed over to courier partner.", timestamp: "Oct 26, 09:00 AM", status: "completed", icon: "truck" },
      { id: "4", title: "Out for Delivery", description: "Your package is out for delivery today!", timestamp: "Oct 29, 08:15 AM", status: "current", icon: "map-pin" },
      { id: "5", title: "Delivered", description: "Package delivered to the address.", timestamp: "Expected by 06:00 PM", status: "pending", icon: "check-circle" },
    ],
    items: [
      { id: "i1", name: "Wireless Noise-Cancelling Headphones", quantity: 1, price: 15000, image: "/placeholder-headphones.jpg" },
      { id: "i2", name: "Premium Leather Wallet", quantity: 1, price: 2500, image: "/placeholder-wallet.jpg" },
    ],
    shippingAddress: {
      name: "Rahul Sharma",
      street: "123, Tech Park, Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      zip: "201309",
    },
  };
};
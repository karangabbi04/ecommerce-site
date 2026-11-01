"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Truck, Download, ArrowRight } from "lucide-react";
import Confetti from "react-confetti";
import {useOrderByRazorPay} from "@/hooks/queries/use-orders";
import { useEffect, useState } from "react";
import SuccessHero from "@/components/order-success/SuccessHero";

import OrderSuccessPageComponent from "@/components/order-success/temp";
import OrderInfoCard from "@/components/order-success/OrderInfoCard";

export default function OrderSuccessPageRoute() {

//   // const orderDetails = useOrderByRazorPay();


//   const params = useParams();
//   const [orderData, setOrderData] = useState<any>(null);

//   const razorpayOrderId = params.checkoutId as string;
//     console.log(razorpayOrderId)

//   // const orderId = searchParams.get("orderId") || "ORD-20260625-1234";

//   const [showConfetti, setShowConfetti] = useState(true);
//   const [windowSize, setWindowSize] = useState({
//     width: 0,
//     height: 0,
//   });

//     const response = useOrderByRazorPay(razorpayOrderId);
//     console.log(response.data)

//   useEffect(() => {
//     setWindowSize({
//       width: window.innerWidth,
//       height: window.innerHeight,
//     });

//     const timer = setTimeout(() => {
//       setShowConfetti(false);
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, []);

//   const products = [
//     {
//       id: 1,
//       name: "Nike Air Max",
//       image:
//         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
//       qty: 1,
//       price: 4999,
//     },
//     {
//       id: 2,
//       name: "Sports T-Shirt",
//       image:
//         "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
//       qty: 2,
//       price: 999,
//     },
//   ];

//   const subtotal = 6997;
//   const gst = 1259;
//   const shipping = 0;
//   const total = subtotal + gst + shipping;

//   const deliveryDate = new Date();
//   deliveryDate.setDate(deliveryDate.getDate() + 4);

//   return (
//     <>

//     <section>
//       <SuccessHero
//       orderId={response.data?.order.orderNumber}
//       onContinueShopping={()=>{

//       }}
//       onViewOrders={()=>{

//       }}
      
//       />
//     </section>
//     <OrderInfoCard
//     paymentId={response.data?.paymentId}
//     amount={response.data?.amount}
//     estimatedDelivery={deliveryDate.toDateString()}
//     />




//     </>
//   );
// }

// app/orders/success/page.tsx
return (

  // app/orders/success/page.tsx
<OrderSuccessPageComponent
  orderId="ORD-2024-001234"
  paymentId="pay_1234567890"
  amount={2499}
  products={[
    {
      id: "1",
      name: "Premium Wireless Headphones",
      image: "/products/headphones.jpg",
      quantity: 1,
      price: 1999,
    },
    {
      id: "2",
      name: "Phone Case - Clear",
      image: "/products/case.jpg",
      quantity: 2,
      price: 250,
    },
  ]}
  orderDate="2024-01-15T10:30:00Z"
/>
)

}



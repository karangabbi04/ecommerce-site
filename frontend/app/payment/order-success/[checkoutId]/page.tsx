"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Truck, Download, ArrowRight } from "lucide-react";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import SuccessHero from "@/components/order-success/SuccessHero";

import OrderInfoCard from "@/components/order-success/OrderInfoCard";

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useParams();

  const checkoutId = params.checkoutId as string;
    console.log(checkoutId)

  // const orderId = searchParams.get("orderId") || "ORD-20260625-1234";

  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const products = [
    {
      id: 1,
      name: "Nike Air Max",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
      qty: 1,
      price: 4999,
    },
    {
      id: 2,
      name: "Sports T-Shirt",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
      qty: 2,
      price: 999,
    },
  ];

  const subtotal = 6997;
  const gst = 1259;
  const shipping = 0;
  const total = subtotal + gst + shipping;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  return (
    <>

    <section>
      <SuccessHero
      orderId={"sljfslkf"}
      onContinueShopping={()=>{

      }}
      onViewOrders={()=>{

      }}
      
      />
    </section>
    <OrderInfoCard
    paymentId={"jklsfjs"}
    amount={3434}
    estimatedDelivery={""}
    />




    </>
  );
}



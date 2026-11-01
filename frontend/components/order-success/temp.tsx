"use client";

import { motion, type Variants } from "framer-motion";
import { CheckCircle2, Package, CreditCard, Download, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type OrderSuccessProps = {
  orderId: string;
  paymentId: string;
  amount: number;
  products: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  orderDate: string;
};

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

export default function OrderSuccessPage({
  orderId,
  paymentId,
  amount,
  products,
  orderDate,
}: OrderSuccessProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. Success Header Section */}
        {/* ---------------------------------------------------------------- */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          {/* Animated Success Icon */}
          <motion.div
            className="relative inline-block mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            <motion.div
              className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="relative bg-linear-to-br from-green-400 to-green-600 rounded-full p-6 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle2 className="h-16 w-16 text-white" strokeWidth={2.5} />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Order Confirmed! 🎉
          </motion.h1>
          
          <motion.p
            className="text-lg text-gray-600 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Thank you for your purchase. Your order has been successfully placed and is being processed.
          </motion.p>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Order Details Card */}
        {/* ---------------------------------------------------------------- */}
        <motion.div variants={itemVariants}>
          <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Order ID */}
                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    <Package className="h-4 w-4" />
                    Order ID
                  </div>
                  <div className="text-lg font-semibold text-gray-900 font-mono break-all">
                    {orderId}
                  </div>
                </motion.div>

                {/* Payment ID */}
                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    <CreditCard className="h-4 w-4" />
                    Payment ID
                  </div>
                  <div className="text-lg font-semibold text-gray-900 font-mono break-all">
                    {paymentId}
                  </div>
                </motion.div>

                {/* Order Date */}
                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Order Date
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </motion.div>

                {/* Total Amount */}
                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Total Amount
                  </div>
                  <motion.div
                    className="text-2xl font-bold text-green-600"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    ₹{amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </motion.div>
                </motion.div>
              </div>

              <Separator className="my-6" />

              {/* Status Badge */}
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="h-2 w-2 rounded-full bg-green-500"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700">Payment Successful</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                  Processing
                </Badge>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Products List */}
        {/* ---------------------------------------------------------------- */}
        <motion.div variants={itemVariants}>
          <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 sm:p-8">
              <motion.h2
                className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <ShoppingBag className="h-5 w-5" />
                Order Items ({products.length})
              </motion.h2>

              <div className="space-y-4">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.7 + index * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {/* Product Image */}
                    <motion.div
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-white shrink-0"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 96px"
                      />
                    </motion.div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>Qty: {product.quantity}</span>
                        <span className="text-gray-300">•</span>
                        <span>₹{product.price.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    {/* Product Total */}
                    <div className="text-right shrink-0">
                      <div className="font-bold text-gray-900">
                        ₹{(product.price * product.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Order Summary */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <Separator className="my-3" />
                <motion.div
                  className="flex justify-between text-lg font-bold text-gray-900"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.3, type: "spring" }}
                >
                  <span>Total Paid</span>
                  <span className="text-green-600">₹{amount.toLocaleString("en-IN")}</span>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* 4. Action Buttons */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          variants={itemVariants}
        >
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              asChild
              size="lg"
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              <Link href={"/tracking" as Route}>
                <Package className="mr-2 h-5 w-5" />
                Track Order
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-2 hover:bg-gray-50"
            >
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="lg"
              className="sm:w-auto"
              onClick={() => window.print()}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Receipt
            </Button>
          </motion.div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Help Section */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-600">
            Need help?{" "}
           
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
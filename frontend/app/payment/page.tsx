"use client"
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCheckout } from "../hooks/queries/use-checkout";
import { string } from "zod";
import { useCreateOrder } from "../hooks/mutations/use-CreateOrder";
import { useVerifyPayment } from "../hooks/mutations/use-VerifyPayment";
import { openRazorpay } from "@/utils/razorpay";




export default function PaymentPage() {

const searchPrams = useSearchParams();


const id = searchPrams.get("id");
const checkoutData = useCheckout(id as string)

console.log(checkoutData.data)


  const [selectedMethod, setSelectedMethod] = useState("upi");


 const { mutateAsync: createOrder } =
    useCreateOrder();

  const { mutateAsync: verifyPayment } =
    useVerifyPayment();


 const handlePayment = async () => {
    try {

      // Step 1
      const order =
        await createOrder(
          id as string
        );

      console.log(
        "Order Created",
        order
      );

      // Step 2
      openRazorpay({

        orderId:order.orderId,

        razorpayOrderId:
          order.data?.razorpayOrderId,

        amount:
          order.data?.amount,

        key:
          order.data?.key,

        onSuccess:
          async (response) => {
  console.log(response.data,"sigggg")


  console.log(response.razorpay_signature,"siggggneatiuresfsfsdfdsf")


            // Step 3
            await verifyPayment({

              orderId:
                order.data?.orderId,

              razorpayOrderId:
                response.razorpay_order_id,

              razorpayPaymentId:
                response.razorpay_payment_id,

              razorpaySignature:
                response.razorpay_signature

            });


            // Step 4
            window.location.href =
              `/order-success/${order.orderId}`;
          }

      });

    } catch (error) {

      console.error(error);
      console.log(error);

      alert(
        "Payment Failed"
      );
    }
  };

  

  const paymentMethods = [
    {
      id: "upi",
      title: "UPI Payment",
      subtitle: "Google Pay, PhonePe, Paytm",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png",
    },
    {
      id: "card",
      title: "Credit / Debit Card",
      subtitle: "Visa, Mastercard, RuPay",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
    },
    {
      id: "cod",
      title: "Cash On Delivery",
      subtitle: "Pay after delivery",
      image:
        "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Payment Checkout 
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Address */}
            <div className="bg-white rounded-3xl shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    📍 Delivery Address
                  </h2>

                  <p className="font-semibold text-lg">
                    {checkoutData?.data?.address.fullName}
                  </p>

                  <p className="text-gray-600 mb-3">
                    91+{checkoutData?.data?.address.phone}
                  </p>

                  <div className="text-gray-700 leading-7">
                    <p>{checkoutData?.data?.address.addressLine1}</p>
                    <p>{checkoutData?.data?.address.postalCode}</p>
                    <p>
                      {checkoutData?.data?.address.city}, {checkoutData?.data?.address.state}
                    </p>
                    <p>{checkoutData?.data?.address.country}</p>
                  </div>
                </div>

                <button className="text-blue-600 font-medium">
                  Change
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-3xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-5">
                💳 Payment Method
              </h2>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() =>
                      setSelectedMethod(method.id)
                    }
                    className={`cursor-pointer border rounded-2xl p-4 transition-all ${
                      selectedMethod === method.id
                        ? "border-black bg-slate-50 ring-2 ring-black"
                        : "hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-4">

                      <img
                        src={method.image}
                        alt={method.title}
                        className="h-12 w-12 object-contain"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {method.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {method.subtitle}
                        </p>
                      </div>

                      <div className="text-2xl">
                        {selectedMethod === method.id
                          ? "✅"
                          : "⭕"}
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* UPI Logos */}
              {selectedMethod === "upi" && (
                <div className="mt-5 p-4 bg-slate-50 rounded-2xl">
                  <p className="font-medium mb-3">
                    Supported Apps
                  </p>

                  <div className="flex gap-4">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/6124/6124998.png"
                      className="h-12"
                    />

                    <img
                      src="https://cdn-icons-png.flaticon.com/512/825/825454.png"
                      className="h-12"
                    />

                    <img
                      src="https://cdn-icons-png.flaticon.com/512/5968/5968269.png"
                      className="h-12"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="sticky top-6 bg-white rounded-3xl shadow-sm border p-6">

              <h2 className="text-xl font-bold mb-5">
                🛒 Order Summary
              </h2>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span>Product Total</span>
                  <span>₹{checkoutData.data?.subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{checkoutData.data?.tax}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>₹{checkoutData.data?.shipping}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{checkoutData.data?.discount}</span>
                </div>

              </div>

              <hr className="my-5" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span>₹{checkoutData.data?.total}</span>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-green-50 text-green-700 text-sm">
                🔒 100% Secure Payment <br />
                Powered by Razorpay
              </div>

              <button 
                onClick={handlePayment}
              className="w-full mt-6 bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:opacity-90">
                {selectedMethod === "cod"
                  ? `Place Order ₹${checkoutData.data?.total}`
                  : `Proceed To Pay ₹${checkoutData.data?.total}`}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
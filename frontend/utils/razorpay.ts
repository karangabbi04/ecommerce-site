export {};

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  razorpayOrderId: string;
  amount: number;
  key: string;
  onSuccess: (response: any) => Promise<void>;
}

export const openRazorpay = ({
  razorpayOrderId,
  amount,
  key,
  onSuccess,
}: RazorpayOptions) => {
  const options = {
    key,
    amount,
    currency: "INR",

    order_id: razorpayOrderId,

    name: "My Ecommerce Store",

    description: "Order Payment",

    handler: async function (response: any) {
      await onSuccess(response);
    },
  };

  const razorpay = new window.Razorpay(options);

  razorpay.open();
};
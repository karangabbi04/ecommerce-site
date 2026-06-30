export {};

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  orderId:string
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
   key:key,
    amount,
    currency: "INR",

    order_id: razorpayOrderId,

    name: "My Ecommerce Store",

    description: "Order Payment",

    handler: async function (response: any) {

      console.log("response this his ", response)
      await onSuccess(response);
    },
  };

  const razorpay = new window.Razorpay(options);

  console.log(razorpay)

  razorpay.open();
};
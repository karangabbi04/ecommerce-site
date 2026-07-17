import { CreditCard, Banknote } from "lucide-react";
import { createElement } from "react";
import { PaymentMethodOption } from "@/types/payment.type";

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "online",
    title: "Pay Online",
    description:
      "UPI, Credit Card, Debit Card, Net Banking & Wallets",
    icon: createElement(CreditCard, { className: "h-6 w-6" }),
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    description:
      "Pay securely when your order is delivered",
    icon: createElement(Banknote, { className: "h-6 w-6" }),
  },
];
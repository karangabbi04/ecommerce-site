"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";                   
import { useCheckout } from "../../../hooks/queries/cart";
import { useCreateAddress,useAttechAddress } from "../../../hooks/mutations/use-address";
import ProductList from "@/components/checkoutPage/productList";
import OrderSummary from "@/components/checkoutPage/orderSummary";
import {
  checkoutAddressSchema,
  type CheckoutFormValues,
} from "@/components/checkoutPage/checkout.schema";
import { attechAddress } from "@/services/address.service";
import AddressForm from "@/components/checkoutPage/addressform/index";
import { useapplyCoupon, useRemoveCoupon } from "@/hooks/mutations/use-coupon";

import { sendAddressOtp } from "../../../hooks/mutations/use-address";

function CheckoutExpiryTimer({
  expiresAt,
  onExpire,
}: {
  expiresAt: string | Date;
  onExpire: () => void;
}) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const hasHandledExpiry = useRef(false);
  const expiresAtTime = new Date(expiresAt).getTime();
  const remainingTime = Math.max(0, expiresAtTime - currentTime);
  const countdown = [
    Math.floor(remainingTime / 3_600_000),
    Math.floor((remainingTime % 3_600_000) / 60_000),
    Math.floor((remainingTime % 60_000) / 1_000),
  ]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAtTime]);

  useEffect(() => {
    if (remainingTime === 0 && !hasHandledExpiry.current) {
      hasHandledExpiry.current = true;
      onExpire();
    }
  }, [onExpire, remainingTime]);

  return (
    <p
      role="status"
      className={`mt-3 text-sm font-medium ${
        remainingTime <= 5 * 60 * 1000 ? "text-red-700" : "text-amber-700"
      }`}
    >
      {remainingTime === 0
        ? "Checkout session expired"
        : `Checkout session expires in ${countdown}`}
    </p>
  );
}

export default function CheckoutPage() {

  const router = useRouter()
  const checkout = useCheckout();
  const sendOtp = sendAddressOtp()
  const applyCoupon=useapplyCoupon()
  const removeCoupon = useRemoveCoupon();
  const [appliedCouponData, setAppliedCouponData] = useState<any>(null);
  const[checkoutId,setcheckoutid]=useState(" ")
  const[addressId,setaddressId]=useState(" ")
  const createAddressMutation = useCreateAddress();
  const AttechAddressMutation = useAttechAddress();
  const [otpSent, setOtpSent] = useState(false);
const [sendingOtp, setSendingOtp] = useState(false);

  const handleCheckoutExpired = () => {
    window.alert("Your checkout session has expired. You will be returned to your cart.");
    try {
      sessionStorage.setItem("open-cart-after-checkout-expiry", "true");
    } catch {
      // Continue to the cart even if session storage is unavailable.
    }
    router.push("/products");
  };

  const handleApplyCoupon = async (code: string) => {
    if (!code.trim() || !checkoutId.trim()) {
      return {};
    }

    const response = await applyCoupon.mutateAsync({
      checkoutSessionId: checkoutId,
      code: code.trim(),
    });
    setAppliedCouponData(response.data);
    return response;
  };

  const handleRemoveCoupon = async () => {
    const response = await removeCoupon.mutateAsync(checkoutId);
    setAppliedCouponData(null);
    return response;
  };


const {id} = useParams();
const checkoutRouteId = Array.isArray(id) ? id[0] : id;

console.log(id,"checkout id ")

const handelOtpSend = async (email:string )=>{

   try {
    setSendingOtp(true);
      sendOtp.mutate( email );

    setOtpSent(true);

  } catch (e) {
      console.log("somthing error")
  } finally {
    setSendingOtp(false);
  }


}




  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutAddressSchema),
  });


  const checkoutsession = async()=>{
     if (!id) return;
     const res = await checkout.mutateAsync();

     setcheckoutid(res.id)
    
  }

  useEffect(() => {
    
    checkoutsession()
   
  }, [id]);




  if ( !checkoutId || !addressId) {
  throw new Error("id or addressId missing");
}

  const handleAddressSubmit = async (data:CheckoutFormValues): Promise<boolean> => {
    const payload = {
      fullName: data.fullName,
      phone: data.phone,
      addressLine1: data.addressLine1,
      landmark: data.landmark,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      latitude: data.latitude,
      longitude: data.longitude,
      email:data.email,
      otp:data.otp,
    };

    console.log("Sending to API:", payload);

     const res =  await createAddressMutation.mutateAsync(payload);
     console.log( res)

       if (res.success) {
        console.log(res.data?.id,"yeeeees")
       
        const newAddressId = res.data.id;
        console.log(newAddressId)

  setaddressId(newAddressId);
          console.log(addressId,"afsjslfj kljlkjskl if")

        const attechRes = await AttechAddressMutation.mutateAsync({checkoutId,addressId:newAddressId})

           console.log(attechAddress)

          if(attechRes.success){
            console.log("adddress atteched ",attechRes)

             router.push(`/payment/${checkoutId}` as any)
             return true;
          }
    }

    return false;
  };

  const checkoutData = checkout.data;

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Review your order and enter delivery details
          </p>
          {checkoutData?.expiresAt && (
            <CheckoutExpiryTimer
              expiresAt={checkoutData.expiresAt}
              onExpire={handleCheckoutExpired}
            />
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="order-2 space-y-6 lg:order-1 lg:col-span-2">
            <AddressForm
              onSubmit={handleAddressSubmit}
              draftKey={`checkout-address-draft:${checkoutRouteId ?? "current"}`}
              isSubmitting={createAddressMutation.isPending}
              onSendOtp={handelOtpSend}
             otpSent={otpSent}
              sendingOtp={sendingOtp}

            />
            
          

            
          </div>


          <div className="order-1 lg:order-2 lg:col-span-1">
            <OrderSummary
              itemsCount={checkoutData?.items?.length ?? 0}
              subtotal={Number(appliedCouponData?.subtotal ?? checkoutData?.subtotal ?? 0)}
              discount={
                appliedCouponData
                  ? Number(appliedCouponData.discountAmount ?? 0)
                  : undefined
              }
              tax={Number(appliedCouponData?.tax ?? checkoutData?.tax ?? 0)}
              shipping={appliedCouponData?.shipping ?? checkoutData?.shipping ?? "Free"}
              total={Number(appliedCouponData?.total ?? checkoutData?.total ?? 0)}
              apply={handleApplyCoupon}
              remove={handleRemoveCoupon}
              isCouponApplied={Boolean(appliedCouponData)}
              isCouponActionPending={applyCoupon.isPending || removeCoupon.isPending}
            />
            <ProductList items={checkoutData?.items ?? []} />
          </div>
        </div>
      </div>
    </main>
  );
}

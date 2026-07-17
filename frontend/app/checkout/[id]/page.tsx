"use client";

import { useEffect, useState } from "react";
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
import { useSendOTP } from "../../../hooks/mutations/use-signup";



export default function CheckoutPage() {

  const router = useRouter()
  const checkout = useCheckout();
  const sendOtp = useSendOTP()
  const[checkoutId,setcheckoutid]=useState(" ")
  const[addressId,setaddressId]=useState(" ")
  const createAddressMutation = useCreateAddress();
  const AttechAddressMutation = useAttechAddress();
  const [otpSent, setOtpSent] = useState(false);
const [sendingOtp, setSendingOtp] = useState(false);


const {id} = useParams();

console.log(id,"checkout id ")

const handelOtpSend = async (email:string )=>{

   try {
    setSendingOtp(true);
      sendOtp.mutate({ email });

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

  const handleAddressSubmit = async (data:CheckoutFormValues) => {
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
          }
    }

   
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
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AddressForm
              onSubmit={handleAddressSubmit}
              isSubmitting={createAddressMutation.isPending}
              onSendOtp={handelOtpSend}
             otpSent={otpSent}
              sendingOtp={sendingOtp}

            />
            
          

            
          </div>


          <div className="lg:col-span-1">
            <OrderSummary
              itemsCount={checkoutData?.items?.length ?? 0}
              subtotal={checkoutData?.subtotal ?? 0}
              tax={checkoutData?.tax ?? 0}
              shipping={checkoutData?.shipping ?? "Free"}
              total={checkoutData?.total ?? 0}
            />
            <ProductList items={checkoutData?.items ?? []} />
          </div>
        </div>
      </div>
    </main>
  );
}

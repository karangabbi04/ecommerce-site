import { useMutation } from "@tanstack/react-query";
import { createAddress, currentLocation, attechAddress, sendOTP } from "@/services/address.service";

export const usecurrentlocation = () => {
  return useMutation({
    mutationFn: currentLocation,
  });
};

export const useCreateAddress = () => {
  return useMutation({
    mutationFn: createAddress,
  });
};


export const useAttechAddress= ()=>{

  return useMutation({
    mutationFn : attechAddress,
  })
}


export const sendAddressOtp= ()=>{

  return useMutation({
    mutationFn : sendOTP,
  })
}
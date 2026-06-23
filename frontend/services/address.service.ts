import { api } from "@/lib/api";

export const getSuggestions = async (city: string) => {
  try {
    console.log("address suggestion api hit");
    console.log(city);

    const res = await api.get(
      `addresses/search?q=${city}`
    );

    console.log("API Success");

    return res.data.data.data;
  } catch (err) {
    console.log("API FAILED");

    throw err;
  }
};

export type currentLocationschema = {
  latitude: number;
  longitude: number;
};

export const currentLocation = async (payLoad: currentLocationschema) => {
  console.log("currentLocation api hit ");

  const response = await api.get(`/addresses/location`, {
    params: {
      lat: payLoad.latitude,
      lon: payLoad.longitude,
    },
  });

  if (!response) {
    console.log(" some issue in api ");
  }

  console.log(response);

  return response.data.data.data;
};

export type CreateAddressPayload = {
  fullName: string;
  phone: string;
  addressLine1: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
};

export const createAddress = async (payload: CreateAddressPayload) => {
  console.log("create address api hit");

  const response = await api.post(`/addresses/`, payload);

  if (!response) {
    console.log("create address api not working");
  }

  console.log("create address response", response);

  return response.data;
};

export const attechAddress = async( payLoad:{checkoutId:string,addressId:string} )=>{


console.log("attech address api hit");

  const response = await api.post(`/addresses/checkout/${payLoad.checkoutId}`,{
    addressId: payLoad.addressId,
  });




  if (!response) {
    console.log("atech address api not working");
  }

  console.log("atech  address response", response);

  return response.data;

}
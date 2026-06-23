import axios from "axios";


export const getLocationwithNomination = async (latitude:Number,longitude:Number)=>{

     const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "my-ecommerce-app",
        },
      }
    );

    const address = response.data;

    const result = {
      displayName: address.display_name || "",
      road: address.address.road || "",
      area:
        address.address.suburb ||
        address.address.neighbourhood ||
        address.address.village ||
        "",
      city:
       address. address.city ||
       address. address.town ||
        address.address.county ||
        "",
      state: address.address.state || "",
      country: address.address.country || "",
      pincode: address.address.postcode || "",
    };

    return {
      success: true,
      data: result,
    }
  } 

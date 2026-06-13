import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler";


export const searchAddress = async(query:string)=>{


    const response = await axios.get(
         "https://photon.komoot.io/api",
      {
        params: {
          q: query,
          countrycode: "IN",
          limit: 4,
        },
      }
    );
    const results = response.data.features.map((item:any) => ({
  name: item.properties.name,
  city: item.properties.city,
  type: item.properties.type,
  county:item.properties.county,
  state: item.properties.state,
  country: item.properties.country,
  lat: item.geometry.coordinates[1],
  lng: item.geometry.coordinates[0]
}));

    return results



}


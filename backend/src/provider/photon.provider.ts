import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler";
import { getCache,setCache } from "../services/cache.service";


const PHOTON_URL =
  "https://photon.komoot.io/api";

  const CACHE_TTL = 60 * 60 * 24;

export const searchAddress = async(query:string)=>{

 const normalizedQuery =
      query.trim().toLowerCase();


      const cacheKey =
      `address-search:${normalizedQuery}`;

    const cachedData =
      await getCache(cacheKey);



      if (cachedData) {
      return{
        data: cachedData,
        source:"radis",
      };
    }


    const response = await axios.get(`${PHOTON_URL}`,
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



await setCache(
      cacheKey,
      results,
      CACHE_TTL
    );

    return {
    source: "photon",
    data: results,
  };



}


import { useMutation, useQuery , useQueryClient} from "@tanstack/react-query";
import { getSuggestions, currentLocation, currentLocationschema  } from "@/services/address.service";


export const useSuggestions = (city: string) => {
  return useQuery({
    queryKey: ["address-suggestions", city],

    queryFn: () => getSuggestions(city),

    enabled: city?.trim().length >= 3,

    staleTime: 5 * 60 * 1000,
  });
};




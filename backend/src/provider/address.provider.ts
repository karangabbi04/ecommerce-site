import {
  AddressSuggestion,
  ValidatedAddress,
} from "../types/address.types.js";

export interface AddressProvider {
  search(query: string): Promise<AddressSuggestion[]>;

  reverseGeocode(
    lat: number,
    lng: number
  ): Promise<ValidatedAddress>;
}
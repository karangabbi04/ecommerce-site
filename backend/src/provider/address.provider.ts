import {
  AddressSuggestion,
  ValidatedAddress,
} from "../types/address.types";

export interface AddressProvider {
  search(query: string): Promise<AddressSuggestion[]>;

  reverseGeocode(
    lat: number,
    lng: number
  ): Promise<ValidatedAddress>;
}
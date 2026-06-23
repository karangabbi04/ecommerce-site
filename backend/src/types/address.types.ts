export interface AddressSuggestion {
  label: string;
  lat: number;
  lng: number;
}

export interface ValidatedAddress {
  fullAddress: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
  verified: boolean;
}
export interface AddressSuggestion {
  label: string;
  lat: number;
  lng: number;
}

export interface ValidatedAddress {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  landmark?: string;
  city: string;
  state: string;
  country?: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  userId?: string;
  guestId?: string;
}


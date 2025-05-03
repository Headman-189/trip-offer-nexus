
export type UserRole = 'client' | 'agency' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  walletBalance?: number;
  agency?: AgencyProfile;
}

export interface AgencyProfile {
  name: string;
  address: string;
  cities: string[];
  postalCode: string;
  iataCode?: string;
  phoneNumber: string;
  landline?: string;
  contactEmail: string;
  claimEmail?: string;
  bio: string;
  imageUrl?: string;
  foundedDate?: string;
  specialty?: string;
}

export type TransportType = 'rail' | 'flight';

export type TravelClass = 'economy' | 'business' | 'first';

export interface TravelPreferences {
  travelClass?: TravelClass;
  cheapestOption?: boolean;
  comfortableOption?: boolean;
  noStopover?: boolean;
  longStopover?: boolean;
  insurance?: boolean;
  carRental?: boolean;
  privateDriver?: boolean;
}

export interface TravelRequest {
  id: string;
  clientId: string;
  departureCity: string;
  destinationCity: string;
  departureDate: string;
  returnDate?: string;
  transportType: TransportType;
  additionalNotes?: string;
  preferences?: TravelPreferences;
  status: 'pending' | 'offers_received' | 'accepted' | 'completed' | 'canceled';
  createdAt: string;
}

export interface OfferPreferencesMatch {
  travelClass?: boolean;
  cheapestOption?: boolean;
  comfortableOption?: boolean;
  noStopover?: boolean;
  longStopover?: boolean;
  insurance?: boolean;
  carRental?: boolean;
  privateDriver?: boolean;
}

export interface TravelOffer {
  id: string;
  requestId: string;
  agencyId: string;
  agencyName: string;
  price: number;
  currency: string;
  description: string;
  departureTime?: string;
  returnTime?: string;
  isBestPrice?: boolean;
  preferencesMatch?: OfferPreferencesMatch;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'completed';
  ticketUrl?: string;
  paymentReference?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'payment' | 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  description: string;
  relatedOfferId?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}


export type UserRole = 'client' | 'agency' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type TransportType = 'rail' | 'flight';

export interface TravelRequest {
  id: string;
  clientId: string;
  departureCity: string;
  destinationCity: string;
  departureDate: string;
  returnDate?: string;
  transportType: TransportType;
  additionalNotes?: string;
  status: 'pending' | 'offers_received' | 'accepted' | 'completed' | 'canceled';
  createdAt: string;
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
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'completed';
  ticketUrl?: string;
  paymentReference?: string;
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

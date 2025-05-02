
import React, { createContext, useState, useContext, ReactNode } from "react";
import { TravelRequest, TravelOffer, Notification, TravelPreferences, OfferPreferencesMatch } from "@/types";
import { mockTravelRequests, mockTravelOffers, mockNotifications } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

interface DataContextType {
  // Travel Requests
  travelRequests: TravelRequest[];
  getUserRequests: (userId: string) => TravelRequest[];
  createTravelRequest: (request: Omit<TravelRequest, "id" | "status" | "createdAt">) => Promise<void>;
  updateTravelRequest: (id: string, updates: Partial<TravelRequest>) => Promise<void>;
  
  // Travel Offers
  travelOffers: TravelOffer[];
  getOffersForRequest: (requestId: string) => TravelOffer[];
  getAgencyOffers: (agencyId: string) => TravelOffer[];
  createTravelOffer: (offer: Omit<TravelOffer, "id" | "createdAt">) => Promise<void>;
  updateTravelOffer: (id: string, updates: Partial<TravelOffer>) => Promise<void>;
  acceptOffer: (offerId: string) => Promise<void>;
  uploadTicket: (offerId: string, ticketUrl: string) => Promise<void>;
  
  // Notifications
  notifications: Notification[];
  getUserNotifications: (userId: string) => Notification[];
  markNotificationAsRead: (id: string) => Promise<void>;
  createNotification: (notification: Omit<Notification, "id" | "createdAt" | "isRead">) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [travelRequests, setTravelRequests] = useState<TravelRequest[]>(mockTravelRequests);
  const [travelOffers, setTravelOffers] = useState<TravelOffer[]>(mockTravelOffers);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Travel Requests Functions
  const getUserRequests = (userId: string) => {
    return travelRequests.filter(request => request.clientId === userId);
  };

  const createTravelRequest = async (request: Omit<TravelRequest, "id" | "status" | "createdAt">) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRequest: TravelRequest = {
      ...request,
      id: `req-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    setTravelRequests(prev => [...prev, newRequest]);
    
    toast({
      title: "Request Created",
      description: "Your travel request has been submitted successfully.",
    });

    // Create notification for agencies
    if (currentUser) {
      createNotification({
        userId: "agency-1", // In a real app, you'd notify all agencies
        title: "New Travel Request",
        message: `New ${newRequest.transportType} request from ${newRequest.departureCity} to ${newRequest.destinationCity}`,
        type: "info",
      });
      
      createNotification({
        userId: "agency-2",
        title: "New Travel Request",
        message: `New ${newRequest.transportType} request from ${newRequest.departureCity} to ${newRequest.destinationCity}`,
        type: "info",
      });
    }
  };

  const updateTravelRequest = async (id: string, updates: Partial<TravelRequest>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTravelRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, ...updates } : request
      )
    );
    
    toast({
      title: "Request Updated",
      description: "Your travel request has been updated successfully.",
    });
  };

  // Travel Offers Functions
  const getOffersForRequest = (requestId: string) => {
    return travelOffers.filter(offer => offer.requestId === requestId);
  };

  const getAgencyOffers = (agencyId: string) => {
    return travelOffers.filter(offer => offer.agencyId === agencyId);
  };

  const createTravelOffer = async (offer: Omit<TravelOffer, "id" | "createdAt">) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newOffer: TravelOffer = {
      ...offer,
      id: `offer-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setTravelOffers(prev => [...prev, newOffer]);
    
    toast({
      title: "Offer Created",
      description: "Your travel offer has been submitted successfully.",
    });

    // Find the request to get the client ID
    const request = travelRequests.find(req => req.id === offer.requestId);
    if (request) {
      // Create notification for the client
      createNotification({
        userId: request.clientId,
        title: "New Travel Offer",
        message: `You've received a new offer from ${offer.agencyName} for your trip to ${
          travelRequests.find(r => r.id === offer.requestId)?.destinationCity || "your destination"
        }.`,
        type: "info",
      });

      // Update request status if this is the first offer
      if (request.status === "pending") {
        updateTravelRequest(request.id, { status: "offers_received" });
      }
    }
  };

  const updateTravelOffer = async (id: string, updates: Partial<TravelOffer>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTravelOffers(prev => 
      prev.map(offer => 
        offer.id === id ? { ...offer, ...updates } : offer
      )
    );
    
    toast({
      title: "Offer Updated",
      description: "The travel offer has been updated successfully.",
    });
  };

  const acceptOffer = async (offerId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the offer
    const offer = travelOffers.find(o => o.id === offerId);
    if (!offer) {
      toast({
        title: "Error",
        description: "Offer not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate payment reference
    const paymentReference = `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    // Update the offer status
    await updateTravelOffer(offerId, { 
      status: "accepted",
      paymentReference
    });
    
    // Update all other offers for this request to rejected
    const otherOffers = travelOffers.filter(o => o.requestId === offer.requestId && o.id !== offerId);
    for (const otherOffer of otherOffers) {
      await updateTravelOffer(otherOffer.id, { status: "rejected" });
    }
    
    // Update the request status
    const request = travelRequests.find(r => r.id === offer.requestId);
    if (request) {
      await updateTravelRequest(request.id, { status: "accepted" });
    }
    
    // Create notifications
    // For the client
    createNotification({
      userId: request?.clientId || "",
      title: "Offer Accepted",
      message: `You've accepted an offer from ${offer.agencyName}. Your payment reference is ${paymentReference}.`,
      type: "success",
    });
    
    // For the agency
    createNotification({
      userId: offer.agencyId,
      title: "Offer Accepted",
      message: `Your offer for ${request?.departureCity || ""} to ${request?.destinationCity || ""} has been accepted. Please prepare the tickets once payment is confirmed.`,
      type: "success",
    });
    
    toast({
      title: "Offer Accepted",
      description: `You've accepted the offer. Your payment reference is ${paymentReference}. Please use this reference when making your bank transfer.`,
    });
  };

  const uploadTicket = async (offerId: string, ticketUrl: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the offer
    const offer = travelOffers.find(o => o.id === offerId);
    if (!offer) {
      toast({
        title: "Error",
        description: "Offer not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the offer
    await updateTravelOffer(offerId, { 
      status: "completed",
      ticketUrl
    });
    
    // Update the request status
    const request = travelRequests.find(r => r.id === offer.requestId);
    if (request) {
      await updateTravelRequest(request.id, { status: "completed" });
    }
    
    // Create notifications
    // For the client
    createNotification({
      userId: request?.clientId || "",
      title: "Ticket Available",
      message: `Your ticket for ${request?.departureCity || ""} to ${request?.destinationCity || ""} is now available for download.`,
      type: "success",
    });
    
    toast({
      title: "Ticket Uploaded",
      description: "The ticket has been successfully uploaded and is available to the client.",
    });
  };

  // Notifications Functions
  const getUserNotifications = (userId: string) => {
    return notifications.filter(notification => notification.userId === userId);
  };

  const markNotificationAsRead = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const createNotification = async (notification: Omit<Notification, "id" | "createdAt" | "isRead">) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  const value = {
    travelRequests,
    getUserRequests,
    createTravelRequest,
    updateTravelRequest,
    
    travelOffers,
    getOffersForRequest,
    getAgencyOffers,
    createTravelOffer,
    updateTravelOffer,
    acceptOffer,
    uploadTicket,
    
    notifications,
    getUserNotifications,
    markNotificationAsRead,
    createNotification,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

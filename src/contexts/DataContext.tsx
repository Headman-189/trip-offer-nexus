import React, { createContext, useState, useContext, ReactNode } from "react";
import { TravelRequest, TravelOffer, Notification, TravelPreferences, OfferPreferencesMatch, Transaction, Message, Conversation, AgencyProfile, User } from "@/types";
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
  uploadTicket: (offerId: string, pdfFile: string) => Promise<void>;
  
  // Notifications
  notifications: Notification[];
  getUserNotifications: (userId?: string) => Notification[];
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  createNotification: (notification: Omit<Notification, "id" | "createdAt" | "isRead">) => Promise<void>;
  
  // Transactions
  transactions: Transaction[];
  getUserTransactions: (userId: string) => Transaction[];
  createTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => Promise<void>;

  // Messaging
  getUserConversations: (userId: string) => Promise<Conversation[]>;
  getConversationMessages: (conversationId: string) => Promise<Message[]>;
  sendMessage: (params: { conversationId: string, senderId: string, recipientId: string, content: string }) => Promise<void>;
  markMessagesAsRead: (conversationId: string, userId: string) => Promise<void>;
  startConversation: (userId1: string, userId2: string) => Promise<string>;
  
  // Agencies
  getAllAgencies: () => Promise<(User & { agency: AgencyProfile })[]>;
  getAgencyById: (agencyId: string) => Promise<(User & { agency: AgencyProfile }) | null>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [travelRequests, setTravelRequests] = useState<TravelRequest[]>(mockTravelRequests);
  const [travelOffers, setTravelOffers] = useState<TravelOffer[]>(mockTravelOffers);
  const [notifications, setNotifications] = useState<Notification[]>([
    ...mockNotifications,
    // Add more mock notifications if needed
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { toast } = useToast();
  const { currentUser, updateUserProfile, getAllUsers } = useAuth();

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
      title: "Demande créée",
      description: "Votre demande de voyage a été soumise avec succès.",
    });

    // Create notification for agencies
    if (currentUser) {
      createNotification({
        userId: "agency-1", // In a real app, you'd notify all agencies
        title: "Nouvelle demande de voyage",
        message: `Nouvelle demande de ${newRequest.transportType} de ${newRequest.departureCity} à ${newRequest.destinationCity}`,
        type: "info",
      });
      
      createNotification({
        userId: "agency-2",
        title: "Nouvelle demande de voyage",
        message: `Nouvelle demande de ${newRequest.transportType} de ${newRequest.departureCity} à ${newRequest.destinationCity}`,
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
      title: "Demande mise à jour",
      description: "Votre demande de voyage a été mise à jour avec succès.",
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
      title: "Offre créée",
      description: "Votre offre de voyage a été soumise avec succès.",
    });

    // Find the request to get the client ID
    const request = travelRequests.find(req => req.id === offer.requestId);
    if (request) {
      // Create notification for the client
      createNotification({
        userId: request.clientId,
        title: "Nouvelle offre de voyage",
        message: `Nouvelle offre de ${offer.agencyName} pour votre voyage de ${
          travelRequests.find(r => r.id === offer.requestId)?.destinationCity || "votre destination"
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
      title: "Offre mise à jour",
      description: "L'offre de voyage a été mise à jour avec succès.",
    });
  };

  const acceptOffer = async (offerId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the offer
    const offer = travelOffers.find(o => o.id === offerId);
    if (!offer) {
      toast({
        title: "Erreur",
        description: "L'offre n'a pas été trouvée.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if this client already has an accepted offer for this request
    const request = travelRequests.find(r => r.id === offer.requestId);
    const existingAcceptedOffer = travelOffers.find(o => 
      o.requestId === offer.requestId && 
      o.status === "accepted" &&
      o.id !== offerId
    );
    
    if (existingAcceptedOffer) {
      toast({
        title: "Erreur",
        description: "Vous avez déjà accepté une offre pour cette demande. Vous devez payer pour plusieurs acceptances.",
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
    
    // Record the transaction
    await createTransaction({
      userId: request?.clientId || "",
      type: "payment",
      amount: offer.price,
      currency: "MAD",
      description: `Paiement pour l'offre ${offerId.substring(0, 8)}`,
      relatedOfferId: offerId
    });
    
    // Update all other offers for this request to rejected if not already accepted
    const otherOffers = travelOffers.filter(o => 
      o.requestId === offer.requestId && 
      o.id !== offerId && 
      o.status !== "accepted"
    );
    
    for (const otherOffer of otherOffers) {
      await updateTravelOffer(otherOffer.id, { status: "rejected" });
    }
    
    // Update the request status
    if (request) {
      await updateTravelRequest(request.id, { status: "accepted" });
    }
    
    // Create notifications
    // For the client
    createNotification({
      userId: request?.clientId || "",
      title: "Offre acceptée",
      message: `Vous avez accepté une offre de ${offer.agencyName}. Votre référence de paiement est ${paymentReference}.`,
      type: "success",
    });
    
    // For the agency
    createNotification({
      userId: offer.agencyId,
      title: "Offre acceptée",
      message: `Votre offre pour ${request?.departureCity || ""} à ${request?.destinationCity || ""} a été acceptée. Veuillez préparer les billets une fois que le paiement sera confirmé.`,
      type: "success",
    });
    
    toast({
      title: "Offre acceptée",
      description: `Vous avez accepté l'offre. Votre référence de paiement est ${paymentReference}. Veuillez utiliser cette référence lors de votre transfert bancaire.`,
    });
  };

  const uploadTicket = async (offerId: string, pdfFile: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the offer
    const offer = travelOffers.find(o => o.id === offerId);
    if (!offer) {
      toast({
        title: "Erreur",
        description: "L'offre n'a pas été trouvée.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the offer
    await updateTravelOffer(offerId, { 
      status: "completed",
      ticketUrl: pdfFile
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
      title: "Ticket disponible",
      message: `Votre PDF de billet pour ${request?.departureCity || ""} à ${request?.destinationCity || ""} est maintenant disponible pour téléchargement.`,
      type: "success",
    });
    
    toast({
      title: "Ticket téléchargé",
      description: "Le PDF de billet a été téléchargé avec succès et est disponible pour le client.",
    });
  };

  // Notifications Functions
  const getUserNotifications = (userId?: string) => {
    // Ne pas appeler useAuth() ici car c'est une fonction normale, pas un composant ou un hook
    const targetUserId = userId || currentUser?.id;
    
    if (!targetUserId) return [];
    
    return notifications.filter(notification => notification.userId === targetUserId);
  };
  
  const markNotificationAsRead = async (notificationId: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    
    return Promise.resolve();
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
  
  // Transactions Functions
  const getUserTransactions = (userId: string) => {
    return transactions.filter(transaction => transaction.userId === userId);
  };
  
  const createTransaction = async (transaction: Omit<Transaction, "id" | "createdAt">) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTransaction: Transaction = {
      ...transaction,
      id: `trans-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString(),
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    
    // Update user wallet balance if necessary
    if (currentUser && currentUser.id === transaction.userId) {
      const currentBalance = currentUser.walletBalance || 0;
      let newBalance = currentBalance;
      
      if (transaction.type === "payment") {
        newBalance -= transaction.amount;
      } else if (transaction.type === "deposit") {
        newBalance += transaction.amount;
      } else if (transaction.type === "withdrawal") {
        newBalance -= transaction.amount;
      }
      
      await updateUserProfile({
        ...currentUser,
        walletBalance: newBalance
      });
    }
  };

  // Messaging Functions
  const getUserConversations = async (userId: string): Promise<Conversation[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get user conversations where the user is a participant
    const userConversations = conversations.filter(conv => 
      conv.participantIds.includes(userId)
    );
    
    // Enrichir les conversations avec les noms des participants
    const enrichedConversations = await Promise.all(userConversations.map(async (conv) => {
      const users = await getAllUsers();
      
      const participantNames = conv.participantIds.map(id => {
        const user = users.find(u => u.id === id);
        return user ? user.name : "Utilisateur inconnu";
      });
      
      return {
        ...conv,
        participantNames
      };
    }));
    
    // Sort by most recent activity
    return enrichedConversations.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  };
  
  const getConversationMessages = async (conversationId: string): Promise<Message[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get messages for the conversation
    const conversationMessages = messages.filter(msg => 
      msg.conversationId === conversationId
    );
    
    // Sort by creation time
    return conversationMessages.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });
  };
  
  const sendMessage = async (params: { 
    conversationId: string, 
    senderId: string, 
    recipientId: string, 
    content: string 
  }): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { conversationId, senderId, recipientId, content } = params;
    
    // Create new message
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      conversationId,
      senderId,
      recipientId,
      content,
      status: "sent",
      createdAt: new Date().toISOString(),
    };
    
    // Add message to state
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation with latest message info
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessageId: newMessage.id,
            lastMessageContent: content,
            lastMessageTime: newMessage.createdAt,
            unreadCount: conv.participantIds.includes(recipientId) ? conv.unreadCount + 1 : conv.unreadCount,
            updatedAt: newMessage.createdAt
          };
        }
        return conv;
      })
    );
  };
  
  const markMessagesAsRead = async (conversationId: string, userId: string): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mark all messages as read where the user is the recipient
    setMessages(prev => 
      prev.map(msg => {
        if (msg.conversationId === conversationId && msg.recipientId === userId && msg.status !== "read") {
          return {
            ...msg,
            status: "read",
            readAt: new Date().toISOString()
          };
        }
        return msg;
      })
    );
    
    // Update conversation unread count
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: 0
          };
        }
        return conv;
      })
    );
  };
  
  const startConversation = async (userId1: string, userId2: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if conversation already exists
    const existingConversation = conversations.find(conv => 
      conv.participantIds.includes(userId1) && conv.participantIds.includes(userId2) && conv.participantIds.length === 2
    );
    
    if (existingConversation) {
      return existingConversation.id;
    }
    
    // Create new conversation
    const newConversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      participantIds: [userId1, userId2],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add conversation to state
    setConversations(prev => [...prev, newConversation]);
    
    return newConversation.id;
  };

  // Agency Functions
  const getAllAgencies = async (): Promise<(User & { agency: AgencyProfile })[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allUsers = await getAllUsers();
    
    return allUsers
      .filter(user => user.role === "agency" && user.agency)
      .map(user => user as User & { agency: AgencyProfile });
  };
  
  const getAgencyById = async (agencyId: string): Promise<(User & { agency: AgencyProfile }) | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allUsers = await getAllUsers();
    const agency = allUsers.find(user => user.id === agencyId && user.role === "agency");
    
    if (!agency || !agency.agency) {
      return null;
    }
    
    return agency as User & { agency: AgencyProfile };
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
    
    transactions,
    getUserTransactions,
    createTransaction,
    
    getUserConversations,
    getConversationMessages,
    sendMessage,
    markMessagesAsRead,
    startConversation,
    
    getAllAgencies,
    getAgencyById,
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

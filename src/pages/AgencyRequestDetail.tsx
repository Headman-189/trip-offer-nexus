
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { RequestNotFound } from "@/components/agency/request/RequestNotFound";
import { RequestDetailsCard } from "@/components/agency/request/RequestDetailsCard";
import { OffersCard } from "@/components/agency/request/OffersCard";
import { StatusInfoCard } from "@/components/agency/request/StatusInfoCard";
import { OfferForm } from "@/components/agency/request/OfferForm";
import { TicketUploader } from "@/components/agency/request/TicketUploader";

export default function AgencyRequestDetail() {
  const { t } = useTranslation();
  const { id: requestId } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const {
    travelRequests,
    getOffersForRequest,
    createTravelOffer,
    uploadTicket,
  } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Dialog states
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  // Form submission states
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [isUploadingTicket, setIsUploadingTicket] = useState(false);
  
  if (!currentUser || !requestId) return null;
  
  // Find the request
  const request = travelRequests.find((r) => r.id === requestId);
  if (!request) {
    return (
      <MainLayout>
        <RequestNotFound />
      </MainLayout>
    );
  }
  
  // Get offers for this request
  const offers = getOffersForRequest(requestId);
  const myOffers = offers.filter(offer => offer.agencyId === currentUser.id);
  const acceptedOffer = offers.find(offer => 
    offer.status === "accepted" || offer.status === "completed"
  );
  
  const isAccepted = acceptedOffer !== undefined;
  const isMyOfferAccepted = acceptedOffer?.agencyId === currentUser.id;
  const canMakeOffer = 
    !myOffers.some(o => o.status === "pending") && // No pending offers from me
    request.status !== "completed" &&
    request.status !== "canceled" &&
    !isAccepted;

  // Handlers
  const handleCreateOffer = async (data: {
    price: number;
    description: string;
    departureTime: string;
    returnTime?: string;
    preferencesMatch: Record<string, boolean>;
  }) => {
    setIsSubmittingOffer(true);
    try {
      await createTravelOffer({
        requestId: request.id,
        agencyId: currentUser.id,
        agencyName: currentUser.name,
        price: data.price,
        currency: "MAD",
        description: data.description,
        departureTime: data.departureTime,
        returnTime: data.returnTime,
        preferencesMatch: Object.keys(data.preferencesMatch).length > 0 ? data.preferencesMatch : undefined,
        status: "pending",
      });
      
      setShowOfferDialog(false);
      
      toast({
        title: t("common.success"),
        description: t("common.offerSubmitted"),
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      toast({
        title: t("common.error"),
        description: t("common.submitError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const handleTicketUploadComplete = async (fileUrl: string) => {
    if (!acceptedOffer) return;
    
    setIsUploadingTicket(true);
    try {
      await uploadTicket(acceptedOffer.id, fileUrl);
      
      setShowUploadDialog(false);
      
      toast({
        title: t("common.success"),
        description: t("common.ticketUploaded"),
      });
    } catch (error) {
      console.error("Error uploading ticket:", error);
      toast({
        title: t("common.error"),
        description: t("common.uploadError"),
        variant: "destructive",
      });
    } finally {
      setIsUploadingTicket(false);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/requests")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("common.backToRequests")}
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Details */}
          <div className="lg:col-span-1">
            <RequestDetailsCard 
              request={request} 
              canMakeOffer={canMakeOffer}
              onCreateOffer={() => setShowOfferDialog(true)}
            />
          </div>
          
          {/* Offers & Actions */}
          <div className="lg:col-span-2">
            {/* My Offers */}
            <OffersCard 
              myOffers={myOffers}
              request={request}
              canMakeOffer={canMakeOffer}
              onCreateOffer={() => setShowOfferDialog(true)}
              onUploadTicket={() => setShowUploadDialog(true)}
            />
            
            {/* Request Status Information */}
            {isAccepted && !isMyOfferAccepted && (
              <StatusInfoCard />
            )}
          </div>
        </div>
      </div>
      
      {/* Create Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("common.createOffer")}</DialogTitle>
            <DialogDescription>
              {t("common.createOfferDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <OfferForm 
            request={request}
            onSubmit={handleCreateOffer}
            isSubmitting={isSubmittingOffer}
            onCancel={() => setShowOfferDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Upload Ticket Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("common.uploadTicket")}</DialogTitle>
            <DialogDescription>
              {t("common.uploadTicketDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <TicketUploader 
            onUploadComplete={handleTicketUploadComplete}
            isUploading={isUploadingTicket}
            onCancel={() => setShowUploadDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

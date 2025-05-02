
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TravelOffer } from "@/types";
import { format } from "date-fns";
import { FileText, CreditCard, ArrowLeft, AlertCircle, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RequestDetail() {
  const { id: requestId } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const {
    travelRequests,
    getOffersForRequest,
    acceptOffer
  } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAccepting, setIsAccepting] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  if (!currentUser || !requestId) return null;
  
  // Find the request
  const request = travelRequests.find((r) => r.id === requestId);
  if (!request) {
    return (
      <MainLayout>
        <div className="animate-fade-in text-center py-12">
          <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
          <h2 className="mt-4 text-2xl font-bold">Request not found</h2>
          <p className="mt-2 text-muted-foreground">
            The travel request you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            className="mt-6"
            onClick={() => navigate("/my-requests")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to my requests
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  // Check if this is the user's request
  if (request.clientId !== currentUser.id) {
    return (
      <MainLayout>
        <div className="animate-fade-in text-center py-12">
          <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
          <h2 className="mt-4 text-2xl font-bold">Access denied</h2>
          <p className="mt-2 text-muted-foreground">
            You don't have permission to view this travel request.
          </p>
          <Button 
            className="mt-6"
            onClick={() => navigate("/my-requests")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to my requests
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  // Get offers for this request
  const offers = getOffersForRequest(requestId);
  const pendingOffers = offers.filter(offer => offer.status === "pending");
  const acceptedOffer = offers.find(offer => offer.status === "accepted" || offer.status === "completed");
  
  // Sort offers by price
  const sortedOffers = [...pendingOffers].sort((a, b) => a.price - b.price);
  const bestPriceOffer = sortedOffers.length > 0 ? sortedOffers[0] : null;
  const alternativeOffers = sortedOffers.length > 1 ? sortedOffers.slice(1) : [];
  
  const departureDate = new Date(request.departureDate);
  const returnDate = request.returnDate ? new Date(request.returnDate) : null;
  
  const getStatusBadge = () => {
    switch (request.status) {
      case "pending":
        return <Badge variant="outline" className="bg-gray-100">Awaiting Offers</Badge>;
      case "offers_received":
        return <Badge className="bg-brand-500">Offers Available</Badge>;
      case "accepted":
        return <Badge className="bg-teal-500">Offer Accepted</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    setIsAccepting(true);
    try {
      await acceptOffer(offerId);
      setSelectedOfferId(offerId);
      setShowPaymentDialog(true);
    } catch (error) {
      console.error("Error accepting offer:", error);
      toast({
        title: "Error",
        description: "Failed to accept the offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const renderOfferCard = (offer: TravelOffer, isBest: boolean = false) => {
    const isSelected = selectedOfferId === offer.id;
    
    return (
      <Card 
        key={offer.id} 
        className={`mb-6 ${isBest ? 'border-brand-500 shadow-md' : ''}`}
      >
        {isBest && (
          <div className="bg-brand-500 text-white px-4 py-1 text-sm font-medium">
            Best Price
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{offer.agencyName}</span>
            <span className="text-2xl">${offer.price.toFixed(2)}</span>
          </CardTitle>
          <CardDescription>
            Offer received on {format(new Date(offer.createdAt), "MMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-4">
            <p>{offer.description}</p>
            
            {offer.departureTime && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Departure</p>
                  <p>{format(new Date(offer.departureTime), "MMM d, yyyy")}</p>
                  <p>{format(new Date(offer.departureTime), "h:mm a")}</p>
                </div>
                {offer.returnTime && (
                  <div>
                    <p className="font-medium">Return</p>
                    <p>{format(new Date(offer.returnTime), "MMM d, yyyy")}</p>
                    <p>{format(new Date(offer.returnTime), "h:mm a")}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleAcceptOffer(offer.id)} 
            disabled={isAccepting}
            className="w-full"
          >
            {isAccepting && isSelected ? "Accepting..." : "Accept Offer"}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/my-requests")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to requests
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <div className="mt-2">{getStatusBadge()}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {request.departureCity} → {request.destinationCity}
                  </h3>
                  <p className="text-muted-foreground capitalize">
                    {request.transportType}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Departure</p>
                    <p>{format(departureDate, "MMM d, yyyy")}</p>
                  </div>
                  {returnDate && (
                    <div>
                      <p className="font-medium">Return</p>
                      <p>{format(returnDate, "MMM d, yyyy")}</p>
                    </div>
                  )}
                </div>
                
                {request.additionalNotes && (
                  <div>
                    <p className="font-medium">Additional Notes</p>
                    <p className="text-muted-foreground">
                      {request.additionalNotes}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="font-medium">Request Date</p>
                  <p className="text-muted-foreground">
                    {format(new Date(request.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Offers */}
          <div className="lg:col-span-2">
            {request.status === "pending" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Awaiting Offers</CardTitle>
                  <CardDescription>
                    Travel agencies are reviewing your request
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No offers yet</h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    Your request is being reviewed by travel agencies. You'll receive a notification when offers are available.
                  </p>
                </CardContent>
              </Card>
            ) : request.status === "offers_received" ? (
              <Tabs defaultValue="best-price" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="best-price">Best Price ({bestPriceOffer ? 1 : 0})</TabsTrigger>
                  <TabsTrigger value="alternatives">Alternatives ({alternativeOffers.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="best-price" className="mt-4">
                  {bestPriceOffer ? (
                    renderOfferCard(bestPriceOffer, true)
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p>No best price offer available</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="alternatives" className="mt-4">
                  {alternativeOffers.length > 0 ? (
                    alternativeOffers.map(offer => renderOfferCard(offer))
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p>No alternative offers available</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            ) : acceptedOffer ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Accepted Offer</span>
                    <span className="text-2xl">${acceptedOffer.price.toFixed(2)}</span>
                  </CardTitle>
                  <CardDescription>
                    From {acceptedOffer.agencyName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    <p>{acceptedOffer.description}</p>
                  </div>
                  
                  {acceptedOffer.departureTime && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Departure</p>
                        <p>{format(new Date(acceptedOffer.departureTime), "MMM d, yyyy")}</p>
                        <p>{format(new Date(acceptedOffer.departureTime), "h:mm a")}</p>
                      </div>
                      {acceptedOffer.returnTime && (
                        <div>
                          <p className="font-medium">Return</p>
                          <p>{format(new Date(acceptedOffer.returnTime), "MMM d, yyyy")}</p>
                          <p>{format(new Date(acceptedOffer.returnTime), "h:mm a")}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {acceptedOffer.paymentReference && (
                    <Alert className="bg-brand-50 border-brand-200">
                      <AlertTitle className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Information
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <div className="space-y-2">
                          <p>Please make a bank transfer with the following details:</p>
                          <div className="font-mono bg-background border rounded p-3">
                            <div><span className="font-medium">Amount:</span> ${acceptedOffer.price.toFixed(2)}</div>
                            <div><span className="font-medium">Reference:</span> {acceptedOffer.paymentReference}</div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Include the payment reference in your bank transfer to ensure proper processing.
                            Once your payment is confirmed, your ticket will be uploaded here.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {acceptedOffer.ticketUrl && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Your ticket is ready!
                      </h3>
                      <Button className="w-full">
                        Download Ticket
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <X className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No offers available</h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    There are no offers for this request. The request may have been canceled or expired.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Instructions</DialogTitle>
            <DialogDescription>
              Please make a bank transfer using the details below.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOfferId && offers.find(o => o.id === selectedOfferId)?.paymentReference && (
            <div className="space-y-4">
              <Alert className="bg-brand-50 border-brand-200">
                <AlertTitle className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Details
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="space-y-2">
                    <div className="font-mono bg-background border rounded p-3">
                      <div>
                        <span className="font-medium">Amount:</span> $
                        {offers.find(o => o.id === selectedOfferId)?.price.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Reference:</span> 
                        {offers.find(o => o.id === selectedOfferId)?.paymentReference}
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
              
              <p className="text-sm text-muted-foreground">
                Make sure to include the payment reference in your bank transfer. 
                Once the agency confirms your payment, they will upload your ticket.
              </p>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

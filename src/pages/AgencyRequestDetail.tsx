
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { PreferencesDisplay } from "@/components/request/PreferencesDisplay";
import { OfferPreferencesMatch } from "@/types";
import { cn } from "@/lib/utils";
import { FileText, ArrowLeft, AlertCircle, Upload, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

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
  
  // State for creating an offer
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [departureTime, setDepartureTime] = useState<Date | undefined>(undefined);
  const [returnTime, setReturnTime] = useState<Date | undefined>(undefined);
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [preferencesMatch, setPreferencesMatch] = useState<OfferPreferencesMatch>({});
  
  // State for uploading a ticket
  const [ticketUrl, setTicketUrl] = useState(""); // In a real app, this would be a file upload
  const [isUploadingTicket, setIsUploadingTicket] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  if (!currentUser || !requestId) return null;
  
  // Find the request
  const request = travelRequests.find((r) => r.id === requestId);
  if (!request) {
    return (
      <MainLayout>
        <div className="animate-fade-in text-center py-12">
          <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
          <h2 className="mt-4 text-2xl font-bold">{t("common.requestNotFound")}</h2>
          <p className="mt-2 text-muted-foreground">
            {t("common.requestNotFoundDescription")}
          </p>
          <Button 
            className="mt-6"
            onClick={() => navigate("/requests")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("common.backToRequests")}
          </Button>
        </div>
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
  
  const canUploadTicket = 
    isMyOfferAccepted && 
    acceptedOffer?.status === "accepted" && 
    !acceptedOffer?.ticketUrl;
  
  const departureDate = new Date(request.departureDate);
  const returnDate = request.returnDate ? new Date(request.returnDate) : null;
  
  const getStatusBadge = () => {
    switch (request.status) {
      case "pending":
        return <Badge variant="outline" className="bg-gray-100">{t("requestStatus.awaitingOffers")}</Badge>;
      case "offers_received":
        return <Badge className="bg-brand-500">{t("requestStatus.hasOffers")}</Badge>;
      case "accepted":
        return <Badge className="bg-teal-500">{t("requestStatus.offerAccepted")}</Badge>;
      case "completed":
        return <Badge className="bg-green-500">{t("requestStatus.completed")}</Badge>;
      case "canceled":
        return <Badge variant="destructive">{t("requestStatus.canceled")}</Badge>;
      default:
        return <Badge variant="outline">{t("requestStatus.unknown")}</Badge>;
    }
  };

  const handlePreferenceMatchChange = (key: keyof OfferPreferencesMatch, value: boolean) => {
    setPreferencesMatch(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!price || !description || !departureTime) {
      toast({
        title: t("common.error"),
        description: t("offerForm.fillAllFields"),
        variant: "destructive",
      });
      return;
    }
    
    if (request.returnDate && !returnTime) {
      toast({
        title: t("common.error"),
        description: t("offerForm.returnTimeRequired"),
        variant: "destructive",
      });
      return;
    }
    
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast({
        title: t("common.error"),
        description: t("offerForm.invalidPrice"),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingOffer(true);
    try {
      await createTravelOffer({
        requestId: request.id,
        agencyId: currentUser.id,
        agencyName: currentUser.name,
        price: numericPrice,
        currency: "USD",
        description,
        departureTime: departureTime.toISOString(),
        returnTime: returnTime ? returnTime.toISOString() : undefined,
        preferencesMatch: Object.keys(preferencesMatch).length > 0 ? preferencesMatch : undefined,
        status: "pending",
      });
      
      setShowOfferDialog(false);
      setPrice("");
      setDescription("");
      setDepartureTime(undefined);
      setReturnTime(undefined);
      setPreferencesMatch({});
      
      toast({
        title: t("common.success"),
        description: t("offerForm.offerSubmitted"),
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      toast({
        title: t("common.error"),
        description: t("offerForm.submitError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const handleUploadTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketUrl || !acceptedOffer) {
      toast({
        title: t("common.error"),
        description: t("ticketUpload.validUrl"),
        variant: "destructive",
      });
      return;
    }
    
    setIsUploadingTicket(true);
    try {
      await uploadTicket(acceptedOffer.id, ticketUrl);
      
      setShowUploadDialog(false);
      setTicketUrl("");
      
      toast({
        title: t("common.success"),
        description: t("ticketUpload.success"),
      });
    } catch (error) {
      console.error("Error uploading ticket:", error);
      toast({
        title: t("common.error"),
        description: t("ticketUpload.error"),
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
            <Card>
              <CardHeader>
                <CardTitle>{t("requestDetail.details")}</CardTitle>
                <div className="mt-2">{getStatusBadge()}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {request.departureCity} → {request.destinationCity}
                  </h3>
                  <p className="text-muted-foreground capitalize">
                    {t(`common.${request.transportType}`)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">{t("common.departure")}</p>
                    <p>{format(departureDate, "MMM d, yyyy")}</p>
                  </div>
                  {returnDate && (
                    <div>
                      <p className="font-medium">{t("common.return")}</p>
                      <p>{format(returnDate, "MMM d, yyyy")}</p>
                    </div>
                  )}
                </div>
                
                {request.preferences && (
                  <div className="border-t border-border pt-4">
                    <PreferencesDisplay preferences={request.preferences} />
                  </div>
                )}
                
                {request.additionalNotes && (
                  <div>
                    <p className="font-medium">{t("common.additionalNotes")}</p>
                    <p className="text-muted-foreground">
                      {request.additionalNotes}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="font-medium">{t("common.requestDate")}</p>
                  <p className="text-muted-foreground">
                    {format(new Date(request.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                
                {canMakeOffer && (
                  <Button 
                    className="w-full mt-4"
                    onClick={() => setShowOfferDialog(true)}
                  >
                    {t("requestDetail.createOffer")}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Offers & Actions */}
          <div className="lg:col-span-2">
            {/* My Offers */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t("requestDetail.myOffers")}</CardTitle>
                <CardDescription>
                  {t("requestDetail.myOffersDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myOffers.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">{t("requestDetail.noOffers")}</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                      {t("requestDetail.noOffersDescription")}
                    </p>
                    
                    {canMakeOffer && (
                      <Button 
                        className="mt-4"
                        onClick={() => setShowOfferDialog(true)}
                      >
                        {t("requestDetail.createOffer")}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {myOffers.map(offer => {
                      const isAccepted = offer.status === "accepted" || offer.status === "completed";
                      
                      return (
                        <div 
                          key={offer.id}
                          className={`border rounded-lg p-4 ${isAccepted ? 'border-teal-500' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-lg">${offer.price.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">
                                {t("requestDetail.offeredOn", { date: format(new Date(offer.createdAt), "MMM d, yyyy") })}
                              </p>
                            </div>
                            {offer.status === "pending" && (
                              <Badge className="bg-brand-100 text-brand-800">{t("offerStatus.pending")}</Badge>
                            )}
                            {offer.status === "accepted" && (
                              <Badge className="bg-teal-500">{t("offerStatus.accepted")}</Badge>
                            )}
                            {offer.status === "rejected" && (
                              <Badge variant="outline" className="bg-red-100 text-red-800">{t("offerStatus.rejected")}</Badge>
                            )}
                            {offer.status === "completed" && (
                              <Badge className="bg-green-500">{t("offerStatus.completed")}</Badge>
                            )}
                          </div>
                          
                          <p className="mt-3">{offer.description}</p>
                          
                          {/* Display which preferences are matched in the offer */}
                          {request.preferences && offer.preferencesMatch && (
                            <div className="mt-4 border-t border-border pt-4">
                              <PreferencesDisplay 
                                preferences={request.preferences} 
                                preferencesMatch={offer.preferencesMatch}
                              />
                            </div>
                          )}
                          
                          {offer.departureTime && (
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div>
                                <p className="font-medium">{t("common.departure")}</p>
                                <p>{format(new Date(offer.departureTime), "MMM d, yyyy")}</p>
                                <p>{format(new Date(offer.departureTime), "h:mm a")}</p>
                              </div>
                              {offer.returnTime && (
                                <div>
                                  <p className="font-medium">{t("common.return")}</p>
                                  <p>{format(new Date(offer.returnTime), "MMM d, yyyy")}</p>
                                  <p>{format(new Date(offer.returnTime), "h:mm a")}</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {isAccepted && offer.paymentReference && (
                            <div className="mt-4">
                              <Alert className="bg-brand-50 border-brand-200">
                                <AlertTitle>{t("payment.information")}</AlertTitle>
                                <AlertDescription className="mt-2">
                                  <div className="font-mono bg-background border rounded p-2">
                                    <div><span className="font-medium">{t("payment.reference")}:</span> {offer.paymentReference}</div>
                                  </div>
                                  <p className="text-sm mt-2">
                                    {t("payment.referenceDescription")}
                                  </p>
                                </AlertDescription>
                              </Alert>
                              
                              {offer.status === "accepted" && !offer.ticketUrl && (
                                <Button 
                                  className="w-full mt-4"
                                  onClick={() => setShowUploadDialog(true)}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  {t("ticketUpload.uploadTicket")}
                                </Button>
                              )}
                            </div>
                          )}
                          
                          {offer.ticketUrl && (
                            <div className="mt-4">
                              <Alert className="bg-green-50 border-green-200">
                                <AlertTitle className="text-green-800">{t("ticketUpload.uploaded")}</AlertTitle>
                                <AlertDescription className="text-green-700 mt-2">
                                  {t("ticketUpload.successDescription")}
                                </AlertDescription>
                              </Alert>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Request Status Information */}
            {isAccepted && !isMyOfferAccepted && (
              <Card className="bg-muted/30">
                <CardContent className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">{t("requestDetail.fulfilled")}</h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    {t("requestDetail.fulfilledDescription")}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("offerForm.title")}</DialogTitle>
            <DialogDescription>
              {t("offerForm.description")}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateOffer} className="space-y-4">
            <div>
              <Label htmlFor="price">{t("offerForm.price")}</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder={t("offerForm.pricePlaceholder")}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">{t("offerForm.description")}</Label>
              <Textarea
                id="description"
                placeholder={t("offerForm.descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>
            
            {/* Client Preferences Match Section */}
            {request.preferences && Object.values(request.preferences).some(val => val) && (
              <div className="border-t border-border pt-4">
                <PreferencesDisplay 
                  preferences={request.preferences}
                  editable={true}
                  preferencesMatch={preferencesMatch}
                  onPreferenceMatchChange={handlePreferenceMatchChange}
                />
              </div>
            )}
            
            <div>
              <Label>{t("offerForm.departureTime")}</Label>
              <div className="grid gap-2 mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !departureTime && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureTime ? (
                        format(departureTime, "PPP")
                      ) : (
                        <span>{t("common.selectDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departureTime}
                      onSelect={setDepartureTime}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                {departureTime && (
                  <Input
                    type="time"
                    value={departureTime ? format(departureTime, "HH:mm") : ""}
                    onChange={(e) => {
                      if (departureTime) {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(departureTime);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setDepartureTime(newDate);
                      }
                    }}
                  />
                )}
              </div>
            </div>
            
            {returnDate && (
              <div>
                <Label>{t("offerForm.returnTime")}</Label>
                <div className="grid gap-2 mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !returnTime && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnTime ? (
                          format(returnTime, "PPP")
                        ) : (
                          <span>{t("common.selectDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={returnTime}
                        onSelect={setReturnTime}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {returnTime && (
                    <Input
                      type="time"
                      value={returnTime ? format(returnTime, "HH:mm") : ""}
                      onChange={(e) => {
                        if (returnTime) {
                          const [hours, minutes] = e.target.value.split(':');
                          const newDate = new Date(returnTime);
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          setReturnTime(newDate);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOfferDialog(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingOffer}
              >
                {isSubmittingOffer ? t("common.submitting") : t("offerForm.submit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Upload Ticket Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("ticketUpload.title")}</DialogTitle>
            <DialogDescription>
              {t("ticketUpload.description")}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUploadTicket} className="space-y-4">
            <div>
              <Label htmlFor="ticketUrl">{t("ticketUpload.url")}</Label>
              <p className="text-sm text-muted-foreground mb-2">
                {t("ticketUpload.note")}
              </p>
              <Input
                id="ticketUrl"
                type="text"
                placeholder="https://example.com/tickets/ticket-123.pdf"
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                required
              />
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUploadDialog(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isUploadingTicket}
              >
                {isUploadingTicket ? t("ticketUpload.uploading") : t("ticketUpload.upload")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

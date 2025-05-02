
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
import { cn } from "@/lib/utils";
import { FileText, ArrowLeft, AlertCircle, Upload, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AgencyRequestDetail() {
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
          <h2 className="mt-4 text-2xl font-bold">Request not found</h2>
          <p className="mt-2 text-muted-foreground">
            The travel request you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            className="mt-6"
            onClick={() => navigate("/requests")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to requests
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
        return <Badge variant="outline" className="bg-gray-100">Awaiting Offers</Badge>;
      case "offers_received":
        return <Badge className="bg-brand-500">Has Offers</Badge>;
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

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!price || !description || !departureTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (request.returnDate && !returnTime) {
      toast({
        title: "Error",
        description: "Return time is required for round trips",
        variant: "destructive",
      });
      return;
    }
    
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
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
        status: "pending",
      });
      
      setShowOfferDialog(false);
      setPrice("");
      setDescription("");
      setDepartureTime(undefined);
      setReturnTime(undefined);
      
      toast({
        title: "Success",
        description: "Your offer has been submitted successfully",
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
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
        title: "Error",
        description: "Please enter a valid ticket URL",
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
        title: "Success",
        description: "The ticket has been successfully uploaded",
      });
    } catch (error) {
      console.error("Error uploading ticket:", error);
      toast({
        title: "Error",
        description: "Failed to upload ticket. Please try again.",
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
                
                {canMakeOffer && (
                  <Button 
                    className="w-full mt-4"
                    onClick={() => setShowOfferDialog(true)}
                  >
                    Create Offer
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
                <CardTitle>My Offers</CardTitle>
                <CardDescription>
                  Offers you've made for this request
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myOffers.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No offers yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                      You haven't made any offers for this request yet.
                    </p>
                    
                    {canMakeOffer && (
                      <Button 
                        className="mt-4"
                        onClick={() => setShowOfferDialog(true)}
                      >
                        Create Offer
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
                                Offered on {format(new Date(offer.createdAt), "MMM d, yyyy")}
                              </p>
                            </div>
                            {offer.status === "pending" && (
                              <Badge className="bg-brand-100 text-brand-800">Pending</Badge>
                            )}
                            {offer.status === "accepted" && (
                              <Badge className="bg-teal-500">Accepted</Badge>
                            )}
                            {offer.status === "rejected" && (
                              <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>
                            )}
                            {offer.status === "completed" && (
                              <Badge className="bg-green-500">Completed</Badge>
                            )}
                          </div>
                          
                          <p className="mt-3">{offer.description}</p>
                          
                          {offer.departureTime && (
                            <div className="grid grid-cols-2 gap-4 mt-3">
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
                          
                          {isAccepted && offer.paymentReference && (
                            <div className="mt-4">
                              <Alert className="bg-brand-50 border-brand-200">
                                <AlertTitle>Payment Information</AlertTitle>
                                <AlertDescription className="mt-2">
                                  <div className="font-mono bg-background border rounded p-2">
                                    <div><span className="font-medium">Reference:</span> {offer.paymentReference}</div>
                                  </div>
                                  <p className="text-sm mt-2">
                                    The client should include this reference in their bank transfer.
                                  </p>
                                </AlertDescription>
                              </Alert>
                              
                              {offer.status === "accepted" && !offer.ticketUrl && (
                                <Button 
                                  className="w-full mt-4"
                                  onClick={() => setShowUploadDialog(true)}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Ticket
                                </Button>
                              )}
                            </div>
                          )}
                          
                          {offer.ticketUrl && (
                            <div className="mt-4">
                              <Alert className="bg-green-50 border-green-200">
                                <AlertTitle className="text-green-800">Ticket Uploaded</AlertTitle>
                                <AlertDescription className="text-green-700 mt-2">
                                  You have successfully uploaded the ticket for this offer.
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
                  <h3 className="mt-4 text-lg font-medium">This request has been fulfilled</h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    The client has accepted an offer from another agency. This request is no longer available for offers.
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
            <DialogTitle>Create Offer</DialogTitle>
            <DialogDescription>
              Submit your offer for this travel request
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateOffer} className="space-y-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide details about the offer, including stops, amenities, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>
            
            <div>
              <Label>Departure Time</Label>
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
                        <span>Select departure date</span>
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
                <Label>Return Time</Label>
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
                          <span>Select return date</span>
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingOffer}
              >
                {isSubmittingOffer ? "Submitting..." : "Submit Offer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Upload Ticket Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Ticket</DialogTitle>
            <DialogDescription>
              Upload the ticket for the client to download
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUploadTicket} className="space-y-4">
            <div>
              <Label htmlFor="ticketUrl">Ticket URL</Label>
              <p className="text-sm text-muted-foreground mb-2">
                In a real app, this would be a file upload. Enter a dummy URL for now.
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploadingTicket}
              >
                {isUploadingTicket ? "Uploading..." : "Upload Ticket"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

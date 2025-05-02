
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TravelOffer } from "@/types";
import { format } from "date-fns";
import { Ticket, ChevronRight } from "lucide-react";

export default function AgencyOffers() {
  const { currentUser } = useAuth();
  const { getAgencyOffers, travelRequests } = useData();
  const navigate = useNavigate();
  
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "completed" | "rejected">("all");
  
  if (!currentUser) return null;
  
  const allOffers = getAgencyOffers(currentUser.id);
  
  // Filter offers based on selection
  const filteredOffers = allOffers.filter(offer => {
    if (filter === "all") return true;
    return offer.status === filter;
  });
  
  // Sort offers by creation date (newest first)
  const sortedOffers = [...filteredOffers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Get request details for an offer
  const getRequestForOffer = (offerId: string) => {
    const offer = allOffers.find(o => o.id === offerId);
    if (!offer) return null;
    
    return travelRequests.find(r => r.id === offer.requestId);
  };

  const getStatusBadge = (status: TravelOffer["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-brand-100 text-brand-800">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-teal-500">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const needsTicketUpload = (offer: TravelOffer) => {
    return offer.status === "accepted" && !offer.ticketUrl;
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Offers</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your offers to client travel requests
            </p>
          </div>
          
          <Button 
            onClick={() => navigate("/requests")}
            className="mt-4 md:mt-0"
          >
            View available requests
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Travel Offers</CardTitle>
                <CardDescription>
                  You have {allOffers.length} total offers
                </CardDescription>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Select
                  value={filter}
                  onValueChange={(value: "all" | "pending" | "accepted" | "completed" | "rejected") => setFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Offers</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sortedOffers.length === 0 ? (
              <div className="py-12 text-center">
                <Ticket className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No offers found</h3>
                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                  {filter !== "all" 
                    ? `You don't have any ${filter} offers. Try changing the filter.`
                    : "You haven't made any offers yet. Browse available requests to submit offers."}
                </p>
                {filter !== "all" && (
                  <Button 
                    variant="outline"
                    className="mt-4"
                    onClick={() => setFilter("all")}
                  >
                    Show all offers
                  </Button>
                )}
                {filter === "all" && (
                  <Button 
                    className="mt-4"
                    onClick={() => navigate("/requests")}
                  >
                    Browse requests
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action Needed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedOffers.map((offer) => {
                      const request = getRequestForOffer(offer.id);
                      const routeText = request 
                        ? `${request.departureCity} → ${request.destinationCity}`
                        : "Unknown route";
                      const dateText = offer.departureTime 
                        ? format(new Date(offer.departureTime), "MMM d, yyyy")
                        : "N/A";
                      
                      return (
                        <TableRow key={offer.id}>
                          <TableCell className="font-medium">
                            {routeText}
                          </TableCell>
                          <TableCell>
                            {dateText}
                          </TableCell>
                          <TableCell>
                            ${offer.price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(offer.status)}
                          </TableCell>
                          <TableCell>
                            {needsTicketUpload(offer) ? (
                              <Badge className="bg-amber-500">Upload Ticket</Badge>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/agency/request/${request?.id}`)}
                              disabled={!request}
                            >
                              View <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          {sortedOffers.length > 0 && (
            <CardFooter className="bg-muted/50 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {sortedOffers.length} of {allOffers.length} offers
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

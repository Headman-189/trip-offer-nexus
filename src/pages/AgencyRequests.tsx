
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
import { TravelRequest } from "@/types";
import { format } from "date-fns";
import { FileText, ChevronRight } from "lucide-react";

export default function AgencyRequests() {
  const { currentUser } = useAuth();
  const { travelRequests, getOffersForRequest, travelOffers } = useData();
  const navigate = useNavigate();
  
  const [filter, setFilter] = useState<"all" | "new" | "responded">("all");
  
  if (!currentUser) return null;
  
  // Get the requests that the agency has already responded to
  const respondedRequestIds = travelOffers
    .filter(offer => offer.agencyId === currentUser.id)
    .map(offer => offer.requestId);
  
  // Filter requests based on selection
  const filteredRequests = travelRequests.filter(request => {
    if (filter === "all") return true;
    if (filter === "new") return !respondedRequestIds.includes(request.id) && request.status !== "completed";
    if (filter === "responded") return respondedRequestIds.includes(request.id);
    return true;
  });
  
  // Sort requests by creation date (newest first)
  const sortedRequests = [...filteredRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStatusBadge = (status: TravelRequest["status"]) => {
    switch (status) {
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

  // Check if a request already has an offer from this agency
  const hasMyOffer = (requestId: string) => {
    return travelOffers.some(
      offer => offer.requestId === requestId && offer.agencyId === currentUser.id
    );
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Travel Requests</h1>
            <p className="text-muted-foreground mt-1">
              View and respond to client travel requests
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Available Requests</CardTitle>
                <CardDescription>
                  Review and make offers for client travel needs
                </CardDescription>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Select
                  value={filter}
                  onValueChange={(value: "all" | "new" | "responded") => setFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter requests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="new">New Requests</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sortedRequests.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No requests found</h3>
                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                  {filter !== "all" 
                    ? `There are no ${filter} requests available. Try changing the filter.`
                    : "There are no travel requests available at the moment."}
                </p>
                {filter !== "all" && (
                  <Button 
                    variant="outline"
                    className="mt-4"
                    onClick={() => setFilter("all")}
                  >
                    Show all requests
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
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Your Offer</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRequests.map((request) => {
                      const departureDate = new Date(request.departureDate);
                      const hasOffer = hasMyOffer(request.id);
                      
                      return (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.departureCity} → {request.destinationCity}
                          </TableCell>
                          <TableCell>
                            {format(departureDate, "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="capitalize">
                            {request.transportType}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell>
                            {hasOffer ? (
                              <Badge variant="outline" className="bg-brand-100 text-brand-800">
                                Submitted
                              </Badge>
                            ) : (
                              <Badge variant="outline">None</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/agency/request/${request.id}`)}
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
          {sortedRequests.length > 0 && (
            <CardFooter className="bg-muted/50 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {sortedRequests.length} of {travelRequests.length} requests
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

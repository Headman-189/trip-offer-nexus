
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
import { CalendarCheck, ChevronRight } from "lucide-react";

export default function ClientRequests() {
  const { currentUser } = useAuth();
  const { getUserRequests } = useData();
  const navigate = useNavigate();
  
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "completed">("all");
  
  if (!currentUser) return null;
  
  const requests = getUserRequests(currentUser.id);
  
  // Filter requests based on selection
  const filteredRequests = requests.filter(request => {
    if (filter === "all") return true;
    if (filter === "pending") return request.status === "pending";
    if (filter === "active") return request.status === "offers_received" || request.status === "accepted";
    if (filter === "completed") return request.status === "completed";
    return true;
  });
  
  // Sort requests by creation date (newest first)
  const sortedRequests = [...filteredRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStatusBadge = (status: TravelRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-gray-100">Pending Offers</Badge>;
      case "offers_received":
        return <Badge className="bg-brand-500">Offers Available</Badge>;
      case "accepted":
        return <Badge className="bg-teal-500">Accepted</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Travel Requests</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your submitted travel requests
            </p>
          </div>
          
          <Button 
            onClick={() => navigate("/create-request")}
            className="mt-4 md:mt-0"
          >
            Create new request
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Travel Requests</CardTitle>
                <CardDescription>
                  You have {requests.length} total requests
                </CardDescription>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Select
                  value={filter}
                  onValueChange={(value: "all" | "pending" | "active" | "completed") => setFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sortedRequests.length === 0 ? (
              <div className="py-12 text-center">
                <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No requests found</h3>
                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                  {filter !== "all" 
                    ? `You don't have any ${filter} requests yet. Try changing the filter.`
                    : "You haven't created any travel requests yet. Create your first request to get started."}
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
                {filter === "all" && (
                  <Button 
                    className="mt-4"
                    onClick={() => navigate("/create-request")}
                  >
                    Create request
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
                      <TableHead>Offers</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRequests.map((request) => {
                      const departureDate = new Date(request.departureDate);
                      const offersCount = request.status === "pending" ? "0" : "...";
                      
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
                          <TableCell>{offersCount}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/request/${request.id}`)}
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
                Showing {sortedRequests.length} of {requests.length} requests
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

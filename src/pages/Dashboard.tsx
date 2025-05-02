
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useTranslation } from "react-i18next";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, Ticket, Mail, ArrowRight, ChartLine } from "lucide-react";
import KPICards from "@/components/analytics/KPICards";
import PerformanceChart from "@/components/analytics/PerformanceChart";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { 
    getUserRequests, 
    getOffersForRequest, 
    getUserNotifications,
    getAgencyOffers 
  } = useData();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isClient = currentUser?.role === "client";
  const isAgency = currentUser?.role === "agency";

  // Get data based on user role
  let pendingRequests = 0;
  let activeOffers = 0;
  let unreadNotifications = 0;
  let allOffers = [];

  if (currentUser) {
    // Get unread notifications
    const notifications = getUserNotifications(currentUser.id);
    unreadNotifications = notifications.filter(n => !n.isRead).length;

    if (isClient) {
      // Get client's requests
      const requests = getUserRequests(currentUser.id);
      pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'offers_received').length;
      
      // Count active offers for all requests
      activeOffers = requests.reduce((count, request) => {
        const offers = getOffersForRequest(request.id);
        return count + offers.filter(o => o.status === 'pending').length;
      }, 0);
    } else if (isAgency) {
      // Count agency's active offers
      const offers = getAgencyOffers(currentUser.id);
      allOffers = offers;
      activeOffers = offers.filter(o => o.status === 'pending').length;
      
      // For agencies, pending requests are ones with no offers from this agency
      const allRequests = offers.map(offer => offer.requestId);
      pendingRequests = allRequests.length;
    }
  }

  if (!currentUser) return null;

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t("common.dashboard")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("common.welcome", { name: currentUser.name })}
            </p>
          </div>
          
          {isClient && (
            <Button 
              onClick={() => navigate("/create-request")}
              className="mt-4 md:mt-0 bg-gradient-to-r from-teal-500 to-brand-600 hover:from-teal-600 hover:to-brand-700"
            >
              {t("common.createRequest")}
            </Button>
          )}
        </div>

        {/* Dashboard cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <CalendarCheck className="h-5 w-5 mr-2 text-teal-600" />
                {isClient ? t("dashboard.activeRequests") : t("dashboard.availableRequests")}
              </CardTitle>
              <CardDescription>
                {isClient ? t("dashboard.yourActiveRequests") : t("dashboard.requestsYouCanOffer")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingRequests}</div>
              <Button 
                variant="link" 
                className="p-0 mt-2 h-auto"
                onClick={() => navigate(isClient ? "/my-requests" : "/requests")}
              >
                {t("common.viewAll")} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Ticket className="h-5 w-5 mr-2 text-brand-600" />
                {isClient ? t("dashboard.activeOffers") : t("dashboard.yourActiveOffers")}
              </CardTitle>
              <CardDescription>
                {isClient ? t("dashboard.offersFromAgencies") : t("dashboard.offersYouMade")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeOffers}</div>
              <Button 
                variant="link" 
                className="p-0 mt-2 h-auto"
                onClick={() => navigate(isClient ? "/my-requests" : "/my-offers")}
              >
                {t("common.viewAll")} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Mail className="h-5 w-5 mr-2 text-teal-600" />
                {t("dashboard.notifications")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.unreadNotifications")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{unreadNotifications}</div>
            </CardContent>
          </Card>
        </div>

        {/* Agency Analytics Section */}
        {isAgency && (
          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center">
                <ChartLine className="mr-2 h-5 w-5 text-teal-600" />
                {t("dashboard.analytics")}
              </h2>
            </div>
            
            <KPICards offers={allOffers} />
            
            <div className="grid gap-6 mt-6">
              <PerformanceChart offers={allOffers} />
            </div>
          </div>
        )}

        {/* Role-specific guidance */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isClient ? t("dashboard.gettingStartedClient") : t("dashboard.gettingStartedAgency")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isClient ? (
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-pastel-blue text-brand-800">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Create a travel request</h3>
                    <p className="text-muted-foreground">
                      Submit your travel details including departure city, destination, dates, and whether you need rail or flight tickets.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-pastel-green text-brand-800">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Receive personalized offers</h3>
                    <p className="text-muted-foreground">
                      Travel agencies will review your request and send you personalized offers with pricing and details.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-pastel-yellow text-brand-800">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Accept an offer and make payment</h3>
                    <p className="text-muted-foreground">
                      Compare offers, choose the best one, and make a bank transfer using the provided reference code.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-pastel-teal text-brand-800">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Receive and download your tickets</h3>
                    <p className="text-muted-foreground">
                      Once payment is confirmed, the travel agency will upload your tickets for you to download.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate("/create-request")}
                  className="mt-4 bg-gradient-to-r from-teal-500 to-brand-600 hover:from-teal-600 hover:to-brand-700"
                >
                  Create my first request
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-pastel-blue text-brand-800">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Browse available travel requests</h3>
                    <p className="text-muted-foreground">
                      View client requests for rail or flight tickets and their specific requirements.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-pastel-green text-brand-800">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Submit personalized offers</h3>
                    <p className="text-muted-foreground">
                      Create competitive offers with pricing and detailed travel information for clients.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-pastel-yellow text-brand-800">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Track accepted offers</h3>
                    <p className="text-muted-foreground">
                      Monitor which offers have been accepted and are awaiting payment confirmation.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-pastel-teal text-brand-800">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Upload tickets for clients</h3>
                    <p className="text-muted-foreground">
                      Once payment is confirmed, upload the PDF tickets for clients to download.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate("/requests")}
                  className="mt-4 bg-gradient-to-r from-teal-500 to-brand-600 hover:from-teal-600 hover:to-brand-700"
                >
                  View available requests
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

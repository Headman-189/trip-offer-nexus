
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BadgeDollarSign, CreditCard, History } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function ClientWallet() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { travelOffers } = useData();
  const [activeTab, setActiveTab] = useState("wallet");
  
  if (!currentUser || currentUser.role !== "client") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-xl text-muted-foreground">{t("common.notAuthorized")}</p>
        </div>
      </MainLayout>
    );
  }
  
  // Get all accepted offers for this client
  const acceptedOffers = travelOffers.filter(offer => {
    const isAccepted = offer.status === "accepted" || offer.status === "completed";
    return isAccepted;
  });
  
  // Calculate total spent
  const totalSpent = acceptedOffers.reduce((sum, offer) => sum + offer.price, 0);
  
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {activeTab === "wallet" ? t("wallet.title") : t("history.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {activeTab === "wallet" 
              ? t("wallet.subtitle") || "Manage your funds and transactions"
              : t("history.subtitle") || "View your purchase history and tickets"
            }
          </p>
        </div>
        
        <Tabs defaultValue="wallet" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px] mb-6">
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t("common.wallet")}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              {t("common.history")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{t("wallet.balance")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BadgeDollarSign className="h-12 w-12 text-primary mr-4" />
                    <div>
                      <div className="text-4xl font-bold">
                        {currentUser.walletBalance || 0} {t("wallet.currency")}
                      </div>
                      <p className="text-muted-foreground">
                        {t("wallet.availableFunds") || "Available funds"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 mt-6">
                    <Button>
                      {t("wallet.addFunds")}
                    </Button>
                    <Button variant="outline">
                      {t("wallet.withdraw")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("history.totalSpent")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {totalSpent} {t("wallet.currency")}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    {acceptedOffers.length} {t("history.acceptedOffers")}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t("wallet.transactions")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">{t("history.date")}</th>
                        <th className="h-10 px-4 text-left font-medium">{t("common.description")}</th>
                        <th className="h-10 px-4 text-left font-medium">{t("history.amount")}</th>
                        <th className="h-10 px-4 text-left font-medium">{t("history.status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {acceptedOffers.length > 0 ? (
                        acceptedOffers.map((offer) => (
                          <tr key={offer.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4">
                              {format(new Date(offer.createdAt), "MMM d, yyyy")}
                            </td>
                            <td className="p-4">
                              {t("payment.offerPayment", {
                                id: offer.id.substring(0, 8)
                              }) || `Payment for offer ${offer.id.substring(0, 8)}`}
                            </td>
                            <td className="p-4 text-destructive font-medium">
                              -{offer.price} {t("wallet.currency")}
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                {t(`payment.${offer.status}`) || offer.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">
                            {t("wallet.noTransactions") || "No transactions yet"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>{t("history.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                {acceptedOffers.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{t("history.totalSpent")}</p>
                        <p className="text-2xl font-bold mt-1">
                          {totalSpent} {t("wallet.currency")}
                        </p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{t("history.totalTickets")}</p>
                        <p className="text-2xl font-bold mt-1">
                          {acceptedOffers.filter(o => o.status === "completed").length}
                        </p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{t("history.acceptedOffers")}</p>
                        <p className="text-2xl font-bold mt-1">
                          {acceptedOffers.length}
                        </p>
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="h-10 px-4 text-left font-medium">{t("history.date")}</th>
                            <th className="h-10 px-4 text-left font-medium">{t("history.trip")}</th>
                            <th className="h-10 px-4 text-left font-medium">{t("history.amount")}</th>
                            <th className="h-10 px-4 text-left font-medium">{t("history.status")}</th>
                            <th className="h-10 px-4 text-right font-medium">{t("common.actions")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {acceptedOffers.map((offer) => (
                            <tr key={offer.id} className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4">
                                {format(new Date(offer.createdAt), "MMM d, yyyy")}
                              </td>
                              <td className="p-4">
                                {offer.agencyName}
                              </td>
                              <td className="p-4 font-medium">
                                {offer.price} {t("wallet.currency")}
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                  offer.status === "completed" 
                                    ? "bg-green-50 text-green-700 ring-green-600/20"
                                    : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                                }`}>
                                  {offer.status === "completed" 
                                    ? t("history.completed") || "Completed" 
                                    : t("history.pending") || "Pending"}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                {offer.ticketUrl && (
                                  <Button variant="outline" size="sm">
                                    {t("history.viewTicket")}
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">{t("history.noHistory")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

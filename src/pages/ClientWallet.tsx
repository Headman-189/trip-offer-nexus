
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClientWallet() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { travelOffers } = useData();
  const [activeTab, setActiveTab] = useState("wallet");
  const [addFundsDialogOpen, setAddFundsDialogOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  
  if (!currentUser || currentUser.role !== "client") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-xl text-muted-foreground">Vous n'êtes pas autorisé à accéder à cette page</p>
        </div>
      </MainLayout>
    );
  }
  
  // Génère un code de suivi unique basé sur l'ID de l'utilisateur et la date
  const generateTrackingCode = () => {
    const userId = currentUser.id.substring(0, 5);
    const timestamp = Date.now().toString().substring(7);
    return `TON-${userId}-${timestamp}`;
  };

  const handleAddFundsClick = () => {
    setTrackingCode(generateTrackingCode());
    setAddFundsDialogOpen(true);
  };
  
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
            {activeTab === "wallet" ? "Votre Portefeuille" : "Historique d'achats"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {activeTab === "wallet" 
              ? "Gérez vos fonds et transactions"
              : "Consultez votre historique d'achats et tickets"
            }
          </p>
        </div>
        
        <Tabs defaultValue="wallet" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px] mb-6">
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Portefeuille
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Solde</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BadgeDollarSign className="h-12 w-12 text-primary mr-4" />
                    <div>
                      <div className="text-4xl font-bold">
                        {currentUser.walletBalance || 0} MAD
                      </div>
                      <p className="text-muted-foreground">
                        Fonds disponibles
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 mt-6">
                    <Button onClick={handleAddFundsClick}>
                      Ajouter des fonds
                    </Button>
                    <Button variant="outline">
                      Retirer
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Total dépensé</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {totalSpent} MAD
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    {acceptedOffers.length} offres acceptées
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Historique des transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Date</th>
                        <th className="h-10 px-4 text-left font-medium">Description</th>
                        <th className="h-10 px-4 text-left font-medium">Montant</th>
                        <th className="h-10 px-4 text-left font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {acceptedOffers.length > 0 ? (
                        acceptedOffers.map((offer) => (
                          <tr key={offer.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4">
                              {format(new Date(offer.createdAt), "dd/MM/yyyy")}
                            </td>
                            <td className="p-4">
                              Paiement pour offre {offer.id.substring(0, 8)}
                            </td>
                            <td className="p-4 text-destructive font-medium">
                              -{offer.price} MAD
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                {offer.status === "completed" ? "Complété" : "Accepté"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">
                            Aucune transaction pour le moment
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
                <CardTitle>Historique d'achats</CardTitle>
              </CardHeader>
              <CardContent>
                {acceptedOffers.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Total dépensé</p>
                        <p className="text-2xl font-bold mt-1">
                          {totalSpent} MAD
                        </p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Total des billets</p>
                        <p className="text-2xl font-bold mt-1">
                          {acceptedOffers.filter(o => o.status === "completed").length}
                        </p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Offres acceptées</p>
                        <p className="text-2xl font-bold mt-1">
                          {acceptedOffers.length}
                        </p>
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="h-10 px-4 text-left font-medium">Date</th>
                            <th className="h-10 px-4 text-left font-medium">Voyage</th>
                            <th className="h-10 px-4 text-left font-medium">Montant</th>
                            <th className="h-10 px-4 text-left font-medium">Statut</th>
                            <th className="h-10 px-4 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {acceptedOffers.map((offer) => (
                            <tr key={offer.id} className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4">
                                {format(new Date(offer.createdAt), "dd/MM/yyyy")}
                              </td>
                              <td className="p-4">
                                {offer.agencyName}
                              </td>
                              <td className="p-4 font-medium">
                                {offer.price} MAD
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                  offer.status === "completed" 
                                    ? "bg-green-50 text-green-700 ring-green-600/20"
                                    : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                                }`}>
                                  {offer.status === "completed" ? "Complété" : "En attente"}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                {offer.ticketUrl && (
                                  <Button variant="outline" size="sm">
                                    Voir le billet
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
                    <p className="text-muted-foreground">Aucun historique d'achat pour le moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogue pour ajouter des fonds */}
      <Dialog open={addFundsDialogOpen} onOpenChange={setAddFundsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter des fonds</DialogTitle>
            <DialogDescription>
              Veuillez utiliser le code de suivi lors de votre virement bancaire
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Montant (en MAD)</Label>
              <Input
                id="amount"
                type="number"
                min="100"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="Entrez le montant"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="trackingCode">Code de suivi pour le virement</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="trackingCode"
                  value={trackingCode}
                  readOnly
                  className="font-mono bg-muted"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(trackingCode);
                    alert("Code copié!");
                  }}
                >
                  Copier
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Utilisez ce code comme référence lors de votre virement
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Instructions de paiement</h4>
              <p className="text-sm mb-2">Coordonnées bancaires:</p>
              <p className="text-sm">Banque: TripOff Bank</p>
              <p className="text-sm">IBAN: MA123456789012345678901234</p>
              <p className="text-sm">BIC: TRIPMARC</p>
              <p className="text-sm mt-2">
                <strong>Important:</strong> N'oubliez pas d'inclure le code de suivi comme référence de paiement.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFundsDialogOpen(false)}>
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

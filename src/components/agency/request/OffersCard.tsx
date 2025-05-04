
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TravelOffer, TravelRequest } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfferItem } from "./OfferItem";

interface OffersCardProps {
  myOffers: TravelOffer[];
  request: TravelRequest;
  canMakeOffer: boolean;
  onCreateOffer: () => void;
  onUploadTicket: () => void;
}

export const OffersCard = ({
  myOffers,
  request,
  canMakeOffer,
  onCreateOffer,
  onUploadTicket
}: OffersCardProps) => {
  const { t } = useTranslation();

  // Convertir TravelPreferences en Record<string, boolean> si nécessaire
  const requestPreferencesAsRecord = request.preferences ? 
    Object.entries(request.preferences).reduce((acc, [key, value]) => {
      if (typeof value === 'boolean') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, boolean>) : 
    undefined;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Mes offres</CardTitle>
        <CardDescription>
          Offres que vous avez faites pour cette demande
        </CardDescription>
      </CardHeader>
      <CardContent>
        {myOffers.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">Aucune offre</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Vous n'avez pas encore fait d'offre pour cette demande de voyage
            </p>
            
            {canMakeOffer && (
              <Button 
                className="mt-4"
                onClick={onCreateOffer}
              >
                Créer une offre
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {myOffers.map(offer => (
              <OfferItem 
                key={offer.id}
                offer={offer}
                requestPreferences={requestPreferencesAsRecord}
                onUploadTicket={
                  offer.status === "accepted" && !offer.ticketUrl 
                    ? onUploadTicket 
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

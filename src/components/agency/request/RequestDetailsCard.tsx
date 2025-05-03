
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { TravelRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { PreferencesDisplay } from "@/components/request/PreferencesDisplay";

interface RequestDetailsCardProps {
  request: TravelRequest;
  canMakeOffer: boolean;
  onCreateOffer: () => void;
}

export const RequestDetailsCard = ({ 
  request, 
  canMakeOffer, 
  onCreateOffer 
}: RequestDetailsCardProps) => {
  const { t } = useTranslation();
  
  const departureDate = new Date(request.departureDate);
  const returnDate = request.returnDate ? new Date(request.returnDate) : null;
  
  const getStatusBadge = () => {
    switch (request.status) {
      case "pending":
        return <Badge variant="outline" className="bg-gray-100">{t("common.awaitingOffers")}</Badge>;
      case "offers_received":
        return <Badge className="bg-brand-500">{t("common.hasOffers")}</Badge>;
      case "accepted":
        return <Badge className="bg-teal-500">{t("common.offerAccepted")}</Badge>;
      case "completed":
        return <Badge className="bg-green-500">{t("common.completed")}</Badge>;
      case "canceled":
        return <Badge variant="destructive">{t("common.canceled")}</Badge>;
      default:
        return <Badge variant="outline">{t("common.unknown")}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("common.details")}</CardTitle>
        <div className="mt-2">{getStatusBadge()}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">
            {request.departureCity} → {request.destinationCity}
          </h3>
          <p className="text-muted-foreground capitalize">
            {request.transportType === 'rail' ? t("common.rail") : t("common.flight")}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">{t("common.departure")}</p>
            <p>{format(departureDate, "dd/MM/yyyy", {locale: fr})}</p>
          </div>
          {returnDate && (
            <div>
              <p className="font-medium">{t("common.return")}</p>
              <p>{format(returnDate, "dd/MM/yyyy", {locale: fr})}</p>
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
            {format(new Date(request.createdAt), "dd/MM/yyyy", {locale: fr})}
          </p>
        </div>
        
        {canMakeOffer && (
          <Button 
            className="w-full mt-4"
            onClick={onCreateOffer}
          >
            {t("common.createOffer")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

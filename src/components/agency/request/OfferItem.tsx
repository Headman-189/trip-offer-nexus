
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { TravelOffer } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PreferencesDisplay } from "@/components/request/PreferencesDisplay";
import { Upload } from "lucide-react";

interface OfferItemProps {
  offer: TravelOffer;
  requestPreferences?: Record<string, boolean>;
  onUploadTicket?: () => void;
}

export const OfferItem = ({ 
  offer, 
  requestPreferences,
  onUploadTicket
}: OfferItemProps) => {
  const { t } = useTranslation();
  
  const isAccepted = offer.status === "accepted" || offer.status === "completed";
  
  return (
    <div 
      className={`border rounded-lg p-4 ${isAccepted ? 'border-teal-500' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-lg">{offer.price.toFixed(2)} {t("wallet.currency")}</p>
          <p className="text-sm text-muted-foreground">
            {t("common.offeredOn", { date: format(new Date(offer.createdAt), "dd/MM/yyyy", {locale: fr}) })}
          </p>
        </div>
        {offer.status === "pending" && (
          <Badge className="bg-brand-100 text-brand-800">{t("common.pending")}</Badge>
        )}
        {offer.status === "accepted" && (
          <Badge className="bg-teal-500">{t("common.accepted")}</Badge>
        )}
        {offer.status === "rejected" && (
          <Badge variant="outline" className="bg-red-100 text-red-800">{t("common.rejected")}</Badge>
        )}
        {offer.status === "completed" && (
          <Badge className="bg-green-500">{t("common.completed")}</Badge>
        )}
      </div>
      
      <p className="mt-3">{offer.description}</p>
      
      {/* Display which preferences are matched in the offer */}
      {requestPreferences && offer.preferencesMatch && (
        <div className="mt-4 border-t border-border pt-4">
          <PreferencesDisplay 
            preferences={requestPreferences} 
            preferencesMatch={offer.preferencesMatch}
          />
        </div>
      )}
      
      {offer.departureTime && (
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p className="font-medium">{t("common.departure")}</p>
            <p>{format(new Date(offer.departureTime), "dd/MM/yyyy", {locale: fr})}</p>
            <p>{format(new Date(offer.departureTime), "HH:mm", {locale: fr})}</p>
          </div>
          {offer.returnTime && (
            <div>
              <p className="font-medium">{t("common.return")}</p>
              <p>{format(new Date(offer.returnTime), "dd/MM/yyyy", {locale: fr})}</p>
              <p>{format(new Date(offer.returnTime), "HH:mm", {locale: fr})}</p>
            </div>
          )}
        </div>
      )}
      
      {isAccepted && offer.paymentReference && (
        <div className="mt-4">
          <Alert className="bg-brand-50 border-brand-200">
            <AlertTitle>{t("common.payment")}</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="font-mono bg-background border rounded p-2">
                <div><span className="font-medium">{t("common.reference")}:</span> {offer.paymentReference}</div>
              </div>
              <p className="text-sm mt-2">
                {t("common.referenceDescription")}
              </p>
            </AlertDescription>
          </Alert>
          
          {offer.status === "accepted" && !offer.ticketUrl && onUploadTicket && (
            <Button 
              className="w-full mt-4"
              onClick={onUploadTicket}
            >
              <Upload className="h-4 w-4 mr-2" />
              {t("common.uploadTicket")}
            </Button>
          )}
        </div>
      )}
      
      {offer.ticketUrl && (
        <div className="mt-4">
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">{t("common.uploaded")}</AlertTitle>
            <AlertDescription className="text-green-700 mt-2">
              {t("common.successDescription")}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

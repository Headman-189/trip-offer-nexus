
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t("common.myOffers")}</CardTitle>
        <CardDescription>
          {t("common.myOffersDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {myOffers.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">{t("common.noOffers")}</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              {t("common.noOffersDescription")}
            </p>
            
            {canMakeOffer && (
              <Button 
                className="mt-4"
                onClick={onCreateOffer}
              >
                {t("common.createOffer")}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {myOffers.map(offer => (
              <OfferItem 
                key={offer.id}
                offer={offer}
                requestPreferences={request.preferences}
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

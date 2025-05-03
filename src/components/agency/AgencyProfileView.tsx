
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AgencyProfile } from "@/types";
import { Building, MapPin, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface AgencyProfileViewProps {
  agency: AgencyProfile;
  agencyId: string;
  showViewButton?: boolean;
}

export default function AgencyProfileView({ agency, agencyId, showViewButton = false }: AgencyProfileViewProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {showViewButton && (
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          {t("common.viewProfile")}
        </Button>
      )}
      
      <Dialog open={isOpen || !showViewButton} onOpenChange={showViewButton ? setIsOpen : undefined}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Building className="h-5 w-5" />
              {agency.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {agency.imageUrl && (
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
                  <img
                    src={agency.imageUrl}
                    alt={agency.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agency.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("agencyProfile.address")}
                    </p>
                    <p>{agency.address}</p>
                    <p>{agency.postalCode}</p>
                  </div>
                </div>
              )}
              
              {agency.cities.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t("agencyProfile.cities")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {agency.cities.map((city, index) => (
                      <span
                        key={index}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {agency.iataCode && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t("agencyProfile.iataCode")}
                </p>
                <p>{agency.iataCode}</p>
              </div>
            )}
            
            {(agency.phoneNumber || agency.landline) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agency.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("agencyProfile.phoneNumber")}
                      </p>
                      <p>{agency.phoneNumber}</p>
                    </div>
                  </div>
                )}
                
                {agency.landline && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("agencyProfile.landline")}
                    </p>
                    <p>{agency.landline}</p>
                  </div>
                )}
              </div>
            )}
            
            {(agency.contactEmail || agency.claimEmail) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agency.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("agencyProfile.contactEmail")}
                      </p>
                      <p>{agency.contactEmail}</p>
                    </div>
                  </div>
                )}
                
                {agency.claimEmail && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("agencyProfile.claimEmail")}
                    </p>
                    <p>{agency.claimEmail}</p>
                  </div>
                )}
              </div>
            )}
            
            {(agency.specialty || agency.foundedDate) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agency.specialty && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("agencyProfile.specialty")}
                    </p>
                    <p>{agency.specialty}</p>
                  </div>
                )}
                
                {agency.foundedDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("agencyProfile.foundedDate")}
                    </p>
                    <p>{format(new Date(agency.foundedDate), "MMMM yyyy")}</p>
                  </div>
                )}
              </div>
            )}
            
            {agency.bio && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t("agencyProfile.bio")}
                </p>
                <p className="whitespace-pre-line">{agency.bio}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

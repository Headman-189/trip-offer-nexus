
import { useTranslation } from "react-i18next";
import { TravelPreferences, OfferPreferencesMatch } from "@/types";
import { 
  ArrowDown, 
  ArrowUp, 
  Plane, 
  Briefcase, 
  Ticket, 
  Bed, 
  StopCircle, 
  Clock, 
  Shield, 
  Car, 
  Luggage,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface PreferencesDisplayProps {
  preferences: TravelPreferences;
  editable?: boolean;
  preferencesMatch?: OfferPreferencesMatch;
  onPreferenceMatchChange?: (key: keyof OfferPreferencesMatch, value: boolean) => void;
}

export const PreferencesDisplay = ({ 
  preferences, 
  editable = false,
  preferencesMatch,
  onPreferenceMatchChange
}: PreferencesDisplayProps) => {
  const { t } = useTranslation();

  // Only show preferences that are set
  const hasPreferences = Object.values(preferences).some(val => val);
  if (!hasPreferences) return null;

  const getMatchIcon = (key: keyof OfferPreferencesMatch) => {
    if (!preferencesMatch) return null;
    if (preferencesMatch[key] === undefined) return null;
    
    return preferencesMatch[key] ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const handleMatchChange = (key: keyof OfferPreferencesMatch, checked: boolean) => {
    if (onPreferenceMatchChange) {
      onPreferenceMatchChange(key, checked);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">{t("preferences.clientPreferences")}</h4>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {preferences.travelClass && (
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-md border",
            editable ? "border-gray-200" : "border-transparent"
          )}>
            {preferences.travelClass === "economy" && <Ticket className="h-4 w-4" />}
            {preferences.travelClass === "business" && <Briefcase className="h-4 w-4" />}
            {preferences.travelClass === "first" && <Luggage className="h-4 w-4" />}
            <span className="text-sm capitalize">{t(`preferences.${preferences.travelClass}`)}</span>
            {editable && (
              <Checkbox 
                className="ml-auto"
                checked={preferencesMatch?.travelClass || false}
                onCheckedChange={(checked) => handleMatchChange('travelClass', !!checked)}
              />
            )}
            {!editable && getMatchIcon('travelClass')}
          </div>
        )}
        
        {preferences.cheapestOption && (
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-md border",
            editable ? "border-gray-200" : "border-transparent"
          )}>
            <ArrowDown className="h-4 w-4" />
            <span className="text-sm">{t("preferences.cheapest")}</span>
            {editable && (
              <Checkbox 
                className="ml-auto"
                checked={preferencesMatch?.cheapestOption || false}
                onCheckedChange={(checked) => handleMatchChange('cheapestOption', !!checked)}
              />
            )}
            {!editable && getMatchIcon('cheapestOption')}
          </div>
        )}
        
        {preferences.comfortableOption && (
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-md border",
            editable ? "border-gray-200" : "border-transparent"
          )}>
            <Bed className="h-4 w-4" />
            <span className="text-sm">{t("preferences.comfortable")}</span>
            {editable && (
              <Checkbox 
                className="ml-auto"
                checked={preferencesMatch?.comfortableOption || false}
                onCheckedChange={(checked) => handleMatchChange('comfortableOption', !!checked)}
              />
            )}
            {!editable && getMatchIcon('comfortableOption')}
          </div>
        )}
        
        {preferences.noStopover && (
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-md border",
            editable ? "border-gray-200" : "border-transparent"
          )}>
            <StopCircle className="h-4 w-4" />
            <span className="text-sm">{t("preferences.noStopover")}</span>
            {editable && (
              <Checkbox 
                className="ml-auto"
                checked={preferencesMatch?.noStopover || false}
                onCheckedChange={(checked) => handleMatchChange('noStopover', !!checked)}
              />
            )}
            {!editable && getMatchIcon('noStopover')}
          </div>
        )}
        
        {preferences.longStopover && (
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-md border",
            editable ? "border-gray-200" : "border-transparent"
          )}>
            <Clock className="h-4 w-4" />
            <span className="text-sm">{t("preferences.longStopover")}</span>
            {editable && (
              <Checkbox 
                className="ml-auto"
                checked={preferencesMatch?.longStopover || false}
                onCheckedChange={(checked) => handleMatchChange('longStopover', !!checked)}
              />
            )}
            {!editable && getMatchIcon('longStopover')}
          </div>
        )}
        
        {preferences.insurance && (
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-md border",
            editable ? "border-gray-200" : "border-transparent"
          )}>
            <Shield className="h-4 w-4" />
            <span className="text-sm">{t("preferences.insurance")}</span>
            {editable && (
              <Checkbox 
                className="ml-auto"
                checked={preferencesMatch?.insurance || false}
                onCheckedChange={(checked) => handleMatchChange('insurance', !!checked)}
              />
            )}
            {!editable && getMatchIcon('insurance')}
          </div>
        )}
        
        {preferences.carRental && (
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-md border",
            editable ? "border-gray-200" : "border-transparent"
          )}>
            <Car className="h-4 w-4" />
            <span className="text-sm">{t("preferences.carRental")}</span>
            {editable && (
              <Checkbox 
                className="ml-auto"
                checked={preferencesMatch?.carRental || false}
                onCheckedChange={(checked) => handleMatchChange('carRental', !!checked)}
              />
            )}
            {!editable && getMatchIcon('carRental')}
          </div>
        )}
        
        {preferences.privateDriver && (
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-md border",
            editable ? "border-gray-200" : "border-transparent"
          )}>
            <Plane className="h-4 w-4" />
            <span className="text-sm">{t("preferences.privateDriver")}</span>
            {editable && (
              <Checkbox 
                className="ml-auto"
                checked={preferencesMatch?.privateDriver || false}
                onCheckedChange={(checked) => handleMatchChange('privateDriver', !!checked)}
              />
            )}
            {!editable && getMatchIcon('privateDriver')}
          </div>
        )}
      </div>
    </div>
  );
};

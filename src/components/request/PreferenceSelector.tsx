
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TravelClass, TravelPreferences } from "@/types";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  Plane, // ✅ remplace Airplane
  Briefcase,
  Ticket,
  Bed,
  StopCircle,
  Clock,
  Shield,
  Car,
  Luggage
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PreferenceSelectorProps {
  preferences: TravelPreferences;
  onChange: (preferences: TravelPreferences) => void;
}

export const PreferenceSelector = ({ preferences, onChange }: PreferenceSelectorProps) => {
  const { t } = useTranslation();
  
  const handleTogglePreference = (key: keyof TravelPreferences) => {
    onChange({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const handleClassChange = (value: TravelClass) => {
    onChange({
      ...preferences,
      travelClass: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Travel Class Options */}
      <div>
        <h3 className="font-medium text-lg mb-3">{t("preferences.travelClass")}</h3>
        <RadioGroup 
          value={preferences.travelClass || "economy"}
          onValueChange={(value) => handleClassChange(value as TravelClass)}
          className="grid grid-cols-3 gap-2"
        >
          <div>
            <RadioGroupItem value="economy" id="economy" className="peer sr-only" />
            <Label
              htmlFor="economy"
              className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Ticket className="mb-2 h-5 w-5" />
              {t("preferences.economy")}
            </Label>
          </div>
          <div>
            <RadioGroupItem value="business" id="business" className="peer sr-only" />
            <Label
              htmlFor="business"
              className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Briefcase className="mb-2 h-5 w-5" />
              {t("preferences.business")}
            </Label>
          </div>
          <div>
            <RadioGroupItem value="first" id="first" className="peer sr-only" />
            <Label
              htmlFor="first"
              className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Luggage className="mb-2 h-5 w-5" />
              {t("preferences.first")}
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Price & Comfort Preferences */}
      <div>
        <h3 className="font-medium text-lg mb-3">{t("preferences.priceComfort")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Toggle
            variant="outline"
            pressed={preferences.cheapestOption}
            onPressedChange={() => handleTogglePreference('cheapestOption')}
            className={cn(
              "flex flex-col h-24 items-center justify-center data-[state=on]:border-primary data-[state=on]:bg-primary/10",
              preferences.cheapestOption && "border-primary"
            )}
          >
            <ArrowDown className="mb-2 h-6 w-6" />
            <span className="text-center">{t("preferences.cheapest")}</span>
          </Toggle>
          
          <Toggle
            variant="outline"
            pressed={preferences.comfortableOption}
            onPressedChange={() => handleTogglePreference('comfortableOption')}
            className={cn(
              "flex flex-col h-24 items-center justify-center data-[state=on]:border-primary data-[state=on]:bg-primary/10",
              preferences.comfortableOption && "border-primary"
            )}
          >
            <Bed className="mb-2 h-6 w-6" />
            <span className="text-center">{t("preferences.comfortable")}</span>
          </Toggle>
          
          <Toggle
            variant="outline"
            pressed={preferences.noStopover}
            onPressedChange={() => handleTogglePreference('noStopover')}
            className={cn(
              "flex flex-col h-24 items-center justify-center data-[state=on]:border-primary data-[state=on]:bg-primary/10",
              preferences.noStopover && "border-primary"
            )}
          >
            <StopCircle className="mb-2 h-6 w-6" />
            <span className="text-center">{t("preferences.noStopover")}</span>
          </Toggle>
          
          <Toggle
            variant="outline"
            pressed={preferences.longStopover}
            onPressedChange={() => handleTogglePreference('longStopover')}
            className={cn(
              "flex flex-col h-24 items-center justify-center data-[state=on]:border-primary data-[state=on]:bg-primary/10",
              preferences.longStopover && "border-primary"
            )}
          >
            <Clock className="mb-2 h-6 w-6" />
            <span className="text-center">{t("preferences.longStopover")}</span>
          </Toggle>
        </div>
      </div>
      
      {/* Additional Services */}
      <div>
        <h3 className="font-medium text-lg mb-3">{t("preferences.additionalServices")}</h3>
        <div className="grid grid-cols-3 gap-2">
          <Toggle
            variant="outline"
            pressed={preferences.insurance}
            onPressedChange={() => handleTogglePreference('insurance')}
            className={cn(
              "flex flex-col h-24 items-center justify-center data-[state=on]:border-primary data-[state=on]:bg-primary/10",
              preferences.insurance && "border-primary"
            )}
          >
            <Shield className="mb-2 h-6 w-6" />
            <span className="text-center">{t("preferences.insurance")}</span>
          </Toggle>
          
          <Toggle
            variant="outline"
            pressed={preferences.carRental}
            onPressedChange={() => handleTogglePreference('carRental')}
            className={cn(
              "flex flex-col h-24 items-center justify-center data-[state=on]:border-primary data-[state=on]:bg-primary/10",
              preferences.carRental && "border-primary"
            )}
          >
            <Car className="mb-2 h-6 w-6" />
            <span className="text-center">{t("preferences.carRental")}</span>
          </Toggle>
          
          <Toggle
            variant="outline"
            pressed={preferences.privateDriver}
            onPressedChange={() => handleTogglePreference('privateDriver')}
            className={cn(
              "flex flex-col h-24 items-center justify-center data-[state=on]:border-primary data-[state=on]:bg-primary/10",
              preferences.privateDriver && "border-primary"
            )}
          >
            <plane className="mb-2 h-6 w-6" />
            <span className="text-center">{t("preferences.privateDriver")}</span>
          </Toggle>
        </div>
      </div>
    </div>
  );
};

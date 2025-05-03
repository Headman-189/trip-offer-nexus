
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Calendar as CalendarIcon } from "lucide-react";
import { TravelRequest, OfferPreferencesMatch } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PreferencesDisplay } from "@/components/request/PreferencesDisplay";
import { cn } from "@/lib/utils";

interface OfferFormProps {
  request: TravelRequest;
  onSubmit: (data: {
    price: number;
    description: string;
    departureTime: string;
    returnTime?: string;
    preferencesMatch: OfferPreferencesMatch;
  }) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const OfferForm = ({ 
  request, 
  onSubmit, 
  isSubmitting,
  onCancel 
}: OfferFormProps) => {
  const { t } = useTranslation();
  
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [departureTime, setDepartureTime] = useState<Date | undefined>(undefined);
  const [returnTime, setReturnTime] = useState<Date | undefined>(undefined);
  const [preferencesMatch, setPreferencesMatch] = useState<OfferPreferencesMatch>({});

  const handlePreferenceMatchChange = (key: keyof OfferPreferencesMatch, value: boolean) => {
    setPreferencesMatch(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departureTime) return;
    
    await onSubmit({
      price: parseFloat(price),
      description,
      departureTime: departureTime.toISOString(),
      returnTime: returnTime ? returnTime.toISOString() : undefined,
      preferencesMatch,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="price">{t("common.price")} ({t("wallet.currency")})</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">{t("common.description")}</Label>
        <Textarea
          id="description"
          placeholder={t("common.descriptionPlaceholder")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
      </div>
      
      {/* Client Preferences Match Section */}
      {request.preferences && Object.values(request.preferences).some(val => val) && (
        <div className="border-t border-border pt-4">
          <PreferencesDisplay 
            preferences={request.preferences}
            editable={true}
            preferencesMatch={preferencesMatch}
            onPreferenceMatchChange={handlePreferenceMatchChange}
          />
        </div>
      )}
      
      <div>
        <Label>{t("common.departureTime")}</Label>
        <div className="grid gap-2 mt-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !departureTime && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureTime ? (
                  format(departureTime, "dd/MM/yyyy", {locale: fr})
                ) : (
                  <span>{t("common.selectDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departureTime}
                onSelect={setDepartureTime}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
          
          {departureTime && (
            <Input
              type="time"
              value={departureTime ? format(departureTime, "HH:mm") : ""}
              onChange={(e) => {
                if (departureTime) {
                  const [hours, minutes] = e.target.value.split(':');
                  const newDate = new Date(departureTime);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  setDepartureTime(newDate);
                }
              }}
            />
          )}
        </div>
      </div>
      
      {request.returnDate && (
        <div>
          <Label>{t("common.returnTime")}</Label>
          <div className="grid gap-2 mt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !returnTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnTime ? (
                    format(returnTime, "dd/MM/yyyy", {locale: fr})
                  ) : (
                    <span>{t("common.selectDate")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnTime}
                  onSelect={setReturnTime}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
            
            {returnTime && (
              <Input
                type="time"
                value={returnTime ? format(returnTime, "HH:mm") : ""}
                onChange={(e) => {
                  if (returnTime) {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date(returnTime);
                    newDate.setHours(parseInt(hours), parseInt(minutes));
                    setReturnTime(newDate);
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("common.submitting") : t("common.submit")}
        </Button>
      </div>
    </form>
  );
};

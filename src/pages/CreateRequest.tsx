
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransportType, TravelPreferences } from "@/types";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PreferenceSelector } from "@/components/request/PreferenceSelector";
import { useTranslation } from "react-i18next";

export default function CreateRequest() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { createTravelRequest } = useData();
  const navigate = useNavigate();
  
  const [departureCity, setDepartureCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [transportType, setTransportType] = useState<TransportType>("flight");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [preferences, setPreferences] = useState<TravelPreferences>({
    travelClass: "economy",
    cheapestOption: false,
    comfortableOption: false,
    noStopover: false,
    longStopover: false,
    insurance: false,
    carRental: false,
    privateDriver: false
  });

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departureCity || !destinationCity || !departureDate || (isRoundTrip && !returnDate)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createTravelRequest({
        clientId: currentUser.id,
        departureCity,
        destinationCity,
        departureDate: departureDate.toISOString(),
        returnDate: isRoundTrip && returnDate ? returnDate.toISOString() : undefined,
        transportType,
        additionalNotes: additionalNotes || undefined,
        preferences
      });
      
      navigate("/my-requests");
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("createRequest.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("createRequest.subtitle")}
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t("createRequest.travelDetails")}</CardTitle>
            <CardDescription>
              {t("createRequest.travelDetailsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="departureCity">{t("common.departureCity")}</Label>
                  <Input
                    id="departureCity"
                    placeholder={t("common.departureCityPlaceholder")}
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationCity">{t("common.destinationCity")}</Label>
                  <Input
                    id="destinationCity"
                    placeholder={t("common.destinationCityPlaceholder")}
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("common.tripType")}</Label>
                </div>
                <RadioGroup
                  value={isRoundTrip ? "roundTrip" : "oneWay"}
                  onValueChange={(value) => setIsRoundTrip(value === "roundTrip")}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="roundTrip" id="roundTrip" />
                    <Label htmlFor="roundTrip">{t("common.roundTrip")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oneWay" id="oneWay" />
                    <Label htmlFor="oneWay">{t("common.oneWay")}</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">{t("common.departureDate")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !departureDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {departureDate ? (
                          format(departureDate, "PPP")
                        ) : (
                          <span>{t("common.selectDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={departureDate}
                        onSelect={setDepartureDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {isRoundTrip && (
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">{t("common.returnDate")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !returnDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {returnDate ? (
                            format(returnDate, "PPP")
                          ) : (
                            <span>{t("common.selectDate")}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={returnDate}
                          onSelect={setReturnDate}
                          initialFocus
                          disabled={(date) => 
                            date < new Date() || 
                            (departureDate && date < departureDate)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>{t("common.transportType")}</Label>
                <RadioGroup
                  value={transportType}
                  onValueChange={(value) => setTransportType(value as TransportType)}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flight" id="flight" />
                    <Label htmlFor="flight">{t("common.flight")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rail" id="rail" />
                    <Label htmlFor="rail">{t("common.rail")}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Travel Preferences Section */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">{t("preferences.title")}</h3>
                <PreferenceSelector 
                  preferences={preferences}
                  onChange={setPreferences}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">{t("common.additionalNotes")}</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder={t("common.additionalNotesPlaceholder")}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("common.submitting") : t("common.submitRequest")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

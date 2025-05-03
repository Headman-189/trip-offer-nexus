
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building, MapPin } from "lucide-react";
import { AgencyProfile as AgencyProfileType } from "@/types";
import { useTranslation } from "react-i18next";

export default function AgencyProfile() {
  const { t } = useTranslation();
  const { currentUser, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const initialProfile: AgencyProfileType = currentUser?.agency || {
    name: currentUser?.name || "",
    address: "",
    cities: [],
    postalCode: "",
    iataCode: "",
    phoneNumber: "",
    landline: "",
    contactEmail: currentUser?.email || "",
    claimEmail: "",
    bio: "",
    specialty: "",
    foundedDate: ""
  };
  
  const [profile, setProfile] = useState<AgencyProfileType>(initialProfile);
  const [citiesInput, setCitiesInput] = useState(initialProfile.cities.join(", "));
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    // Parse cities from comma-separated string
    const parsedCities = citiesInput
      .split(",")
      .map(city => city.trim())
      .filter(city => city.length > 0);
    
    const updatedProfile = {
      ...profile,
      cities: parsedCities
    };
    
    try {
      // In a real app, update the profile in the database
      await updateUserProfile({
        ...currentUser,
        agency: updatedProfile
      });
      
      toast({
        title: t("common.success"),
        description: t("agencyProfile.profileUpdated")
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
      toast({
        title: t("common.error"),
        description: t("agencyProfile.errorUpdating"),
        variant: "destructive"
      });
    }
  };
  
  if (!currentUser || currentUser.role !== "agency") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-xl text-muted-foreground">{t("common.notAuthorized")}</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("agencyProfile.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("agencyProfile.subtitle")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {isEditing ? t("agencyProfile.editProfile") : profile.name || t("agencyProfile.name")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("agencyProfile.name")}</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="foundedDate">{t("agencyProfile.foundedDate")}</Label>
                      <Input
                        id="foundedDate"
                        name="foundedDate"
                        type="date"
                        value={profile.foundedDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">{t("agencyProfile.address")}</Label>
                      <Input 
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">{t("agencyProfile.postalCode")}</Label>
                      <Input 
                        id="postalCode"
                        name="postalCode"
                        value={profile.postalCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cities">{t("agencyProfile.cities")}</Label>
                    <Input 
                      id="cities"
                      placeholder={t("agencyProfile.citiesPlaceholder") || "Casablanca, Marrakech, Tangier"}
                      value={citiesInput}
                      onChange={(e) => setCitiesInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("agencyProfile.citiesHelp") || "Comma-separated list of cities"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="iataCode">{t("agencyProfile.iataCode")}</Label>
                      <Input 
                        id="iataCode"
                        name="iataCode"
                        value={profile.iataCode}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specialty">{t("agencyProfile.specialty")}</Label>
                      <Input 
                        id="specialty"
                        name="specialty"
                        value={profile.specialty}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">{t("agencyProfile.phoneNumber")}</Label>
                      <Input 
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="landline">{t("agencyProfile.landline")}</Label>
                      <Input 
                        id="landline"
                        name="landline"
                        value={profile.landline}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">{t("agencyProfile.contactEmail")}</Label>
                      <Input 
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={profile.contactEmail}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="claimEmail">{t("agencyProfile.claimEmail")}</Label>
                      <Input 
                        id="claimEmail"
                        name="claimEmail"
                        type="email"
                        value={profile.claimEmail}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">{t("agencyProfile.bio")}</Label>
                    <Textarea 
                      id="bio"
                      name="bio"
                      rows={4}
                      value={profile.bio}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      {t("common.cancel")}
                    </Button>
                    <Button onClick={handleSave}>
                      {t("agencyProfile.saveProfile")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {profile.imageUrl && (
                    <div className="flex justify-center mb-6">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
                        <img
                          src={profile.imageUrl}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {t("agencyProfile.address")}
                          </p>
                          <p>{profile.address}</p>
                          <p>{profile.postalCode}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile.cities.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {t("agencyProfile.cities")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {profile.cities.map((city, index) => (
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
                  
                  {profile.iataCode && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("agencyProfile.iataCode")}
                      </p>
                      <p>{profile.iataCode}</p>
                    </div>
                  )}
                  
                  {(profile.phoneNumber || profile.landline) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profile.phoneNumber && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {t("agencyProfile.phoneNumber")}
                          </p>
                          <p>{profile.phoneNumber}</p>
                        </div>
                      )}
                      
                      {profile.landline && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {t("agencyProfile.landline")}
                          </p>
                          <p>{profile.landline}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {(profile.contactEmail || profile.claimEmail) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profile.contactEmail && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {t("agencyProfile.contactEmail")}
                          </p>
                          <p>{profile.contactEmail}</p>
                        </div>
                      )}
                      
                      {profile.claimEmail && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {t("agencyProfile.claimEmail")}
                          </p>
                          <p>{profile.claimEmail}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {profile.specialty && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("agencyProfile.specialty")}
                      </p>
                      <p>{profile.specialty}</p>
                    </div>
                  )}
                  
                  {profile.bio && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("agencyProfile.bio")}
                      </p>
                      <p className="whitespace-pre-line">{profile.bio}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setIsEditing(true)}>
                      {t("agencyProfile.editProfile")}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("wallet.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {currentUser.walletBalance || 0} {t("wallet.currency")}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("wallet.balanceDescription")}
                </p>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    {t("wallet.addFunds")}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t("wallet.withdraw")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

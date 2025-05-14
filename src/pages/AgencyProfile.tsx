
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building, MapPin, X } from "lucide-react";
import { AgencyProfile as AgencyProfileType } from "@/types";

export default function AgencyProfile() {
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
    foundedDate: "",
    markets: []
  };
  
  const [profile, setProfile] = useState<AgencyProfileType>(initialProfile);
  const [citiesInput, setCitiesInput] = useState(initialProfile.cities.join(", "));
  const [marketsInput, setMarketsInput] = useState(initialProfile.markets?.join(", ") || "");
  
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
    
    // Parse markets from comma-separated string
    const parsedMarkets = marketsInput
      .split(",")
      .map(market => market.trim())
      .filter(market => market.length > 0);
    
    const updatedProfile = {
      ...profile,
      cities: parsedCities,
      markets: parsedMarkets
    };
    
    try {
      // In a real app, update the profile in the database
      await updateUserProfile({
        ...currentUser,
        agency: updatedProfile
      });
      
      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour"
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
        variant: "destructive"
      });
    }
  };
  
  if (!currentUser || currentUser.role !== "agency") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-xl text-muted-foreground">Vous n'êtes pas autorisé à accéder à cette page</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profil de l'agence</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les informations de votre agence de voyage
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {isEditing ? "Modifier le profil" : profile.name || "Nom de l'agence"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom de l'agence</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="foundedDate">Date de création</Label>
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
                      <Label htmlFor="address">Adresse</Label>
                      <Input 
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input 
                        id="postalCode"
                        name="postalCode"
                        value={profile.postalCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cities">Villes desservies</Label>
                    <Input 
                      id="cities"
                      placeholder="Casablanca, Marrakech, Tanger"
                      value={citiesInput}
                      onChange={(e) => setCitiesInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Liste des villes séparées par des virgules
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="markets">Marchés</Label>
                    <Input 
                      id="markets"
                      placeholder="Europe, Afrique, Moyen-Orient"
                      value={marketsInput}
                      onChange={(e) => setMarketsInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Liste des marchés séparés par des virgules (ex: Europe, Afrique, Moyen-Orient)
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="iataCode">Code IATA</Label>
                      <Input 
                        id="iataCode"
                        name="iataCode"
                        value={profile.iataCode}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Spécialité</Label>
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
                      <Label htmlFor="phoneNumber">Téléphone mobile</Label>
                      <Input 
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="landline">Téléphone fixe</Label>
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
                      <Label htmlFor="contactEmail">Email de contact</Label>
                      <Input 
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={profile.contactEmail}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="claimEmail">Email de réclamation</Label>
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
                    <Label htmlFor="bio">Présentation de l'agence</Label>
                    <Textarea 
                      id="bio"
                      name="bio"
                      rows={4}
                      value={profile.bio}
                      onChange={handleChange}
                      placeholder="Décrivez votre agence, son histoire, ses domaines d'expertise..."
                    />
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSave}>
                      Enregistrer
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
                            Adresse
                          </p>
                          <p>{profile.address}</p>
                          <p>{profile.postalCode}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile.cities.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Villes desservies
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

                  {profile.markets && profile.markets.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Marchés
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.markets.map((market, index) => (
                          <span
                            key={index}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                          >
                            {market}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profile.iataCode && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Code IATA
                      </p>
                      <p>{profile.iataCode}</p>
                    </div>
                  )}
                  
                  {(profile.phoneNumber || profile.landline) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profile.phoneNumber && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Téléphone mobile
                          </p>
                          <p>{profile.phoneNumber}</p>
                        </div>
                      )}
                      
                      {profile.landline && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Téléphone fixe
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
                            Email de contact
                          </p>
                          <p>{profile.contactEmail}</p>
                        </div>
                      )}
                      
                      {profile.claimEmail && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Email de réclamation
                          </p>
                          <p>{profile.claimEmail}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {profile.specialty && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Spécialité
                      </p>
                      <p>{profile.specialty}</p>
                    </div>
                  )}
                  
                  {profile.bio && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Présentation de l'agence
                      </p>
                      <p className="whitespace-pre-line">{profile.bio}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setIsEditing(true)}>
                      Modifier le profil
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
                <CardTitle>Portefeuille</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {currentUser.walletBalance || 0} MAD
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Balance actuelle de votre portefeuille
                </p>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    Alimenter
                  </Button>
                  <Button variant="outline" size="sm">
                    Retirer
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

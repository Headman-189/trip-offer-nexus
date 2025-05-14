
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { MapPin, Mail, Phone, Calendar, Briefcase, Star } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { AgencyProfile as AgencyProfileType, User } from "@/types";

export default function AgencyPublicProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { getAgencyById, startConversation } = useData();
  const [loading, setLoading] = useState(true);
  const [agency, setAgency] = useState<User & { agency: AgencyProfileType } | null>(null);
  
  useEffect(() => {
    const loadAgency = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const agencyData = await getAgencyById(id);
        
        if (!agencyData) {
          toast({
            title: "Erreur",
            description: "Cette agence n'existe pas",
            variant: "destructive",
          });
          navigate("/agencies");
          return;
        }
        
        setAgency(agencyData);
      } catch (error) {
        console.error("Erreur lors du chargement de l'agence", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de l'agence",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAgency();
  }, [id, getAgencyById, toast, navigate]);

  const handleContactAgency = async () => {
    if (!currentUser || !agency) return;
    
    try {
      await startConversation(currentUser.id, agency.id);
      navigate("/messages");
      toast({
        title: "Conversation créée",
        description: `Vous pouvez maintenant discuter avec ${agency.name}`
      });
    } catch (error) {
      console.error("Erreur lors de la création de la conversation", error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la conversation",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="h-64 bg-muted rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!agency) return null;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
          {agency.agency.imageUrl ? (
            <img
              src={agency.agency.imageUrl}
              alt={agency.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Avatar className="h-32 w-32">
                <div className="font-semibold text-4xl">
                  {agency.name.charAt(0)}
                </div>
              </Avatar>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">{agency.name}</h1>
            {agency.agency.specialty && (
              <p className="text-white/80">
                Spécialiste en {agency.agency.specialty}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>À propos de l'agence</CardTitle>
              </CardHeader>
              <CardContent>
                {agency.agency.bio ? (
                  <div className="whitespace-pre-line">
                    {agency.agency.bio}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    Cette agence n'a pas encore ajouté de description.
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Marchés</CardTitle>
              </CardHeader>
              <CardContent>
                {agency.agency.markets && agency.agency.markets.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {agency.agency.markets.map((market, index) => (
                      <span 
                        key={index}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md"
                      >
                        {market}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    Aucun marché spécifié
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Villes desservies</CardTitle>
              </CardHeader>
              <CardContent>
                {agency.agency.cities && agency.agency.cities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {agency.agency.cities.map((city, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md"
                      >
                        <MapPin className="h-3 w-3" />
                        <span>{city}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    Aucune ville spécifiée
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agency.agency.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Téléphone mobile</p>
                      <p>{agency.agency.phoneNumber}</p>
                    </div>
                  </div>
                )}
                
                {agency.agency.landline && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Téléphone fixe</p>
                      <p>{agency.agency.landline}</p>
                    </div>
                  </div>
                )}
                
                {agency.agency.contactEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p>{agency.agency.contactEmail}</p>
                    </div>
                  </div>
                )}
                
                {agency.agency.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Adresse</p>
                      <p>{agency.agency.address}</p>
                      {agency.agency.postalCode && (
                        <p>{agency.agency.postalCode}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full mt-4" 
                  onClick={handleContactAgency}
                  disabled={!currentUser || currentUser.id === agency.id}
                >
                  Envoyer un message
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agency.agency.foundedDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Date de création</p>
                      <p>{format(new Date(agency.agency.foundedDate), "MMMM yyyy", { locale: fr })}</p>
                    </div>
                  </div>
                )}
                
                {agency.agency.iataCode && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Code IATA</p>
                      <p>{agency.agency.iataCode}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

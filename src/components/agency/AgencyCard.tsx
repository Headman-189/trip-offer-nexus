
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MapPin, Mail, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AgencyProfile, User } from "@/types";

interface AgencyCardProps {
  agency: User & { agency: AgencyProfile };
  currentUserId: string;
}

export default function AgencyCard({ agency, currentUserId }: AgencyCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startConversation } = useData();
  const [showContact, setShowContact] = useState(false);
  
  const handleViewProfile = () => {
    navigate(`/agency/${agency.id}`);
  };
  
  const handleContactAgency = async () => {
    if (!currentUserId) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour contacter une agence",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await startConversation(currentUserId, agency.id);
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

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <AspectRatio ratio={16/9} className="bg-muted">
        {agency.agency.imageUrl ? (
          <img 
            src={agency.agency.imageUrl}
            alt={agency.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-secondary">
            <Avatar className="h-20 w-20">
              <div className="font-semibold text-2xl">
                {agency.name.charAt(0)}
              </div>
            </Avatar>
          </div>
        )}
      </AspectRatio>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{agency.name}</h3>
            {agency.agency.specialty && (
              <p className="text-sm text-muted-foreground">
                Spécialiste en {agency.agency.specialty}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        {agency.agency.cities && agency.agency.cities.length > 0 && (
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {agency.agency.cities.slice(0, 3).map((city, i) => (
                <span key={i} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-xs">
                  {city}
                </span>
              ))}
              {agency.agency.cities.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{agency.agency.cities.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        {agency.agency.bio && (
          <p className="text-sm line-clamp-3 mb-2">
            {agency.agency.bio}
          </p>
        )}

        {agency.agency.foundedDate && (
          <p className="text-xs text-muted-foreground">
            En activité depuis {new Date(agency.agency.foundedDate).getFullYear()}
          </p>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button variant="outline" onClick={handleViewProfile}>
            Voir profil
          </Button>
          <Button onClick={() => setShowContact(true)}>
            Contacter
          </Button>
        </div>
      </CardFooter>

      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contacter {agency.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {agency.agency.phoneNumber && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p>{agency.agency.phoneNumber}</p>
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
            
            <div className="pt-4">
              <Button onClick={handleContactAgency} className="w-full">
                Envoyer un message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

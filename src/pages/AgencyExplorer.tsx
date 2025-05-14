
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import AgencyCard from "@/components/agency/AgencyCard";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Search, X } from "lucide-react";

export default function AgencyExplorer() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { getAllAgencies } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [agencies, setAgencies] = useState<any[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<any[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([]);

  useEffect(() => {
    const loadAgencies = async () => {
      try {
        const agencyList = await getAllAgencies();
        setAgencies(agencyList);
        setFilteredAgencies(agencyList);
        
        // Extraire toutes les villes uniques de toutes les agences
        const cities = new Set<string>();
        const specialties = new Set<string>();
        
        agencyList.forEach(agency => {
          if (agency.agency) {
            agency.agency.cities?.forEach((city: string) => cities.add(city));
            if (agency.agency.specialty) specialties.add(agency.agency.specialty);
          }
        });
        
        setAvailableCities(Array.from(cities));
        setAvailableSpecialties(Array.from(specialties));
      } catch (error) {
        console.error("Erreur lors du chargement des agences", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des agences",
          variant: "destructive",
        });
      }
    };
    
    loadAgencies();
  }, [getAllAgencies, toast]);

  useEffect(() => {
    // Filtrer les agences selon les critères
    const filtered = agencies.filter(agency => {
      const matchesSearch = searchQuery === "" || 
        agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (agency.agency?.bio && agency.agency.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCity = cityFilter === "" ||
        (agency.agency?.cities && agency.agency.cities.some((city: string) => 
          city.toLowerCase().includes(cityFilter.toLowerCase())));
      
      const matchesSpecialty = specialtyFilter === "" ||
        (agency.agency?.specialty && 
         agency.agency.specialty.toLowerCase().includes(specialtyFilter.toLowerCase()));
      
      return matchesSearch && matchesCity && matchesSpecialty;
    });
    
    setFilteredAgencies(filtered);
  }, [searchQuery, cityFilter, specialtyFilter, agencies]);

  const clearFilters = () => {
    setSearchQuery("");
    setCityFilter("");
    setSpecialtyFilter("");
  };

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Exploration des Agences de Voyage</h1>
          <p className="text-muted-foreground">
            Découvrez les meilleures agences de voyage et contactez-les directement
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recherche et Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom ou description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                    >
                      <option value="">Toutes les villes</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={specialtyFilter}
                      onChange={(e) => setSpecialtyFilter(e.target.value)}
                    >
                      <option value="">Toutes les spécialités</option>
                      {availableSpecialties.map((specialty) => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {(searchQuery || cityFilter || specialtyFilter) && (
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                        <span>Recherche: {searchQuery}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setSearchQuery("")}
                        />
                      </div>
                    )}
                    {cityFilter && (
                      <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                        <span>Ville: {cityFilter}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setCityFilter("")}
                        />
                      </div>
                    )}
                    {specialtyFilter && (
                      <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                        <span>Spécialité: {specialtyFilter}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setSpecialtyFilter("")}
                        />
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Effacer tous les filtres
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgencies.length > 0 ? 
            filteredAgencies.map((agency) => (
              <AgencyCard 
                key={agency.id} 
                agency={agency} 
                currentUserId={currentUser?.id || ""} 
              />
            )) : 
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-muted-foreground">
                Aucune agence ne correspond à vos critères de recherche
              </p>
              <Button 
                variant="link" 
                onClick={clearFilters} 
                className="mt-2"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          }
        </div>
      </div>
    </MainLayout>
  );
}

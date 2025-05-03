
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/components/ui/user";
import { useTranslation } from "react-i18next";

export default function ClientProfile() {
  const { t } = useTranslation();
  const { currentUser, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      if (!currentUser) return;
      
      await updateUserProfile({
        ...currentUser,
        name: profile.name,
        email: profile.email
      });
      
      setIsEditing(false);
      
      toast({
        title: t("common.success"),
        description: t("common.profileUpdated")
      });
    } catch (error) {
      console.error("Error updating profile", error);
      toast({
        title: t("common.error"),
        description: t("common.errorUpdating"),
        variant: "destructive"
      });
    }
  };
  
  if (!currentUser) return null;
  
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("common.profile")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("common.manageProfile")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("common.personalInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("common.name")}</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("common.email")}</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      {t("common.cancel")}
                    </Button>
                    <Button onClick={handleSave}>
                      {t("common.save")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("common.name")}
                      </p>
                      <p className="font-medium">{currentUser.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("common.email")}
                      </p>
                      <p>{currentUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("common.role")}
                      </p>
                      <p className="capitalize">{currentUser.role}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("common.memberSince")}
                      </p>
                      <p>{new Date(currentUser.createdAt).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setIsEditing(true)}>
                      {t("common.editProfile")}
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
                  <Button variant="outline" size="sm" onClick={() => window.location.href = "/wallet"}>
                    {t("wallet.details")}
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

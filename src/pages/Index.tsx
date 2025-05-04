
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const Index = () => {
  const { currentUser, isLoading } = useAuth();
  const { t } = useTranslation();

  // Add debug logging
  useEffect(() => {
    console.log("Index component rendered");
    console.log("Current user:", currentUser);
    console.log("Is loading:", isLoading);
  }, [currentUser, isLoading]);

  // Si chargement en cours, afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">{t("common.loading")}</span>
      </div>
    );
  }

  // Si connecté, rediriger vers le tableau de bord
  if (currentUser) {
    console.log("Redirecting logged in user to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Sinon, rediriger vers la page d'accueil
  console.log("User not logged in, redirecting to landing page");
  return <Navigate to="/" replace />;
};

export default Index;

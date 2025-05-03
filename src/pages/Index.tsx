
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { currentUser, isLoading } = useAuth();
  const { t } = useTranslation();

  // Si chargement en cours, afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">{t("common.loading")}</span>
      </div>
    );
  }

  // Si connecté, rediriger vers le tableau de bord approprié selon le rôle
  if (currentUser) {
    // Rediriger vers la bonne page en fonction du rôle de l'utilisateur
    if (currentUser.role === 'agency') {
      return <Navigate to="/requests" replace />;
    } else {
      return <Navigate to="/my-requests" replace />;
    }
  }

  // Sinon, rediriger vers la page d'accueil
  return <Navigate to="/" replace />;
};

export default Index;

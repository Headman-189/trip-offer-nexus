
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { currentUser, isLoading } = useAuth();
  const { t } = useTranslation();

  // If still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">{t("common.loading")}</span>
      </div>
    );
  }

  // If logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, redirect to the landing page
  return <Navigate to="/" replace />;
};

export default Index;

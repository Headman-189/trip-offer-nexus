
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function DesktopNavLinks() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  
  const isClient = currentUser && currentUser.role === "client";
  const isAgency = currentUser && currentUser.role === "agency";
  
  // Fonction pour générer les classes CSS pour les liens actifs
  const getLinkClasses = ({ isActive }: { isActive: boolean }) => {
    return cn(
      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "text-muted-foreground hover:bg-muted hover:text-primary"
    );
  };
  
  return (
    <div className="hidden md:flex md:space-x-1">
      {/* Liens communs à tous les utilisateurs */}
      <NavLink to="/dashboard" className={getLinkClasses}>
        {t("navigation.dashboard")}
      </NavLink>
      
      <NavLink to="/agencies" className={getLinkClasses}>
        {t("navigation.agencies")}
      </NavLink>
      
      {/* Liens pour les clients */}
      {isClient && (
        <>
          <NavLink to="/requests" className={getLinkClasses}>
            {t("navigation.myRequests")}
          </NavLink>
          <NavLink to="/create-request" className={getLinkClasses}>
            {t("navigation.createRequest")}
          </NavLink>
          <NavLink to="/wallet" className={getLinkClasses}>
            {t("navigation.wallet")}
          </NavLink>
        </>
      )}
      
      {/* Liens pour les agences */}
      {isAgency && (
        <>
          <NavLink to="/agency-requests" className={getLinkClasses}>
            {t("navigation.requests")}
          </NavLink>
          <NavLink to="/agency-offers" className={getLinkClasses}>
            {t("navigation.myOffers")}
          </NavLink>
        </>
      )}

      {/* Messagerie - disponible pour tout utilisateur connecté */}
      {currentUser && (
        <NavLink to="/messages" className={getLinkClasses}>
          {t("navigation.messages")}
        </NavLink>
      )}
    </div>
  );
}

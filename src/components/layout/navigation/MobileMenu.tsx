
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  
  const isClient = currentUser && currentUser.role === "client";
  const isAgency = currentUser && currentUser.role === "agency";
  
  const closeMenu = () => setIsOpen(false);
  
  // Fonction pour générer les classes CSS pour les liens actifs
  const getLinkClasses = ({ isActive }: { isActive: boolean }) => {
    return cn(
      "block px-3 py-2 rounded-md text-base font-medium w-full text-left",
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "text-muted-foreground hover:bg-muted hover:text-primary"
    );
  };
  
  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        size="icon"
        aria-label="Menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute top-16 inset-x-0 z-50 bg-background border-b shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Liens communs à tous les utilisateurs */}
            <NavLink 
              to="/dashboard" 
              className={getLinkClasses} 
              onClick={closeMenu}
            >
              {t("navigation.dashboard")}
            </NavLink>

            <NavLink 
              to="/agencies" 
              className={getLinkClasses} 
              onClick={closeMenu}
            >
              {t("navigation.agencies")}
            </NavLink>
            
            {/* Liens pour les clients */}
            {isClient && (
              <>
                <NavLink 
                  to="/requests" 
                  className={getLinkClasses} 
                  onClick={closeMenu}
                >
                  {t("navigation.myRequests")}
                </NavLink>
                
                <NavLink 
                  to="/create-request" 
                  className={getLinkClasses} 
                  onClick={closeMenu}
                >
                  {t("navigation.createRequest")}
                </NavLink>
                
                <NavLink 
                  to="/wallet" 
                  className={getLinkClasses} 
                  onClick={closeMenu}
                >
                  {t("navigation.wallet")}
                </NavLink>
              </>
            )}
            
            {/* Liens pour les agences */}
            {isAgency && (
              <>
                <NavLink 
                  to="/agency-requests" 
                  className={getLinkClasses} 
                  onClick={closeMenu}
                >
                  {t("navigation.requests")}
                </NavLink>
                
                <NavLink 
                  to="/agency-offers" 
                  className={getLinkClasses} 
                  onClick={closeMenu}
                >
                  {t("navigation.myOffers")}
                </NavLink>
                
                <NavLink 
                  to="/agency-profile" 
                  className={getLinkClasses} 
                  onClick={closeMenu}
                >
                  {t("navigation.profile")}
                </NavLink>
              </>
            )}

            {/* Messagerie - disponible pour tout utilisateur connecté */}
            {currentUser && (
              <NavLink 
                to="/messages" 
                className={getLinkClasses} 
                onClick={closeMenu}
              >
                {t("navigation.messages")}
              </NavLink>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

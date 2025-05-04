
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BrandLogo from "./navigation/BrandLogo";
import DesktopNavLinks from "./navigation/DesktopNavLinks";
import MobileMenu from "./navigation/MobileMenu";
import NotificationsDropdown from "./navigation/NotificationsDropdown";
import UserMenu from "./navigation/UserMenu";

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: t("common.logout"),
      description: t("common.logoutSuccess"),
    });
  };

  const isClient = currentUser?.role === "client";
  const isAgency = currentUser?.role === "agency";

  if (!currentUser) return null;

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-6">
        <BrandLogo />

        {/* Desktop Navigation */}
        {currentUser && (
          <DesktopNavLinks isClient={isClient} isAgency={isAgency} />
        )}

        {/* Mobile Menu Trigger */}
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          isClient={isClient}
          isAgency={isAgency}
          handleLogout={handleLogout}
        />
      </div>

      <div className="flex items-center space-x-4">
        {currentUser && (
          <>
            <LanguageSwitcher />
            
            <NotificationsDropdown userId={currentUser.id} />

            <UserMenu 
              userName={currentUser.name} 
              userEmail={currentUser.email}
              isClient={isClient}
              handleLogout={handleLogout}
            />
          </>
        )}
      </div>
    </nav>
  );
}

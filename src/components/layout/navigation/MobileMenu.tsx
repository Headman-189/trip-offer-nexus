
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isClient: boolean;
  isAgency: boolean;
  handleLogout: () => void;
}

export default function MobileMenu({ 
  isOpen, 
  setIsOpen, 
  isClient, 
  isAgency, 
  handleLogout 
}: MobileMenuProps) {
  const { t } = useTranslation();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="space-y-4 py-4">
            <h2 className="text-xl font-semibold mb-4">{t("common.menu")}</h2>
            <div className="space-y-2">
              <NavLink
                to="/dashboard"
                className="block py-2 px-3 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {t("common.dashboard")}
              </NavLink>
              
              {isClient && (
                <>
                  <NavLink
                    to="/my-requests"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("common.myRequests")}
                  </NavLink>
                  <NavLink
                    to="/create-request"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("common.createRequest")}
                  </NavLink>
                  <NavLink
                    to="/wallet"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("common.wallet")}
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("common.profile")}
                  </NavLink>
                </>
              )}

              {isAgency && (
                <>
                  <NavLink
                    to="/requests"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("common.travelRequests")}
                  </NavLink>
                  <NavLink
                    to="/my-offers"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("common.myOffers")}
                  </NavLink>
                  <NavLink
                    to="/agency/profile"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("common.profile")}
                  </NavLink>
                </>
              )}
              
              <div className="border-t border-gray-200 my-2 pt-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500" 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("common.logout")}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

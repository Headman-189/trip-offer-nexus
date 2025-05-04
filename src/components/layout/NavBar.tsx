
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut, User, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const { getUserNotifications, markNotificationAsRead } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const userNotifications = getUserNotifications(currentUser.id);
      setNotifications(userNotifications);
      setUnreadCount(
        userNotifications.filter((notification) => !notification.isRead).length
      );
    }
  }, [currentUser, getUserNotifications]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: t("common.logout"),
      description: t("common.logoutSuccess"),
    });
  };

  const handleNotificationClick = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const isClient = currentUser?.role === "client";
  const isAgency = currentUser?.role === "agency";

  if (!currentUser) return null;

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-6">
        <NavLink to="/dashboard" className="flex items-center">
          <span className="text-xl font-semibold text-brand-800">
            TripOfferNexus
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        {currentUser && (
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              end
            >
              {t("common.dashboard")}
            </NavLink>

            {isClient && (
              <>
                <NavLink
                  to="/my-requests"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  {t("common.myRequests")}
                </NavLink>
                <NavLink
                  to="/create-request"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  {t("common.createRequest")}
                </NavLink>
                <NavLink
                  to="/wallet"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  {t("common.wallet")}
                </NavLink>
              </>
            )}

            {isAgency && (
              <>
                <NavLink
                  to="/requests"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  {t("common.travelRequests")}
                </NavLink>
                <NavLink
                  to="/my-offers"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  {t("common.myOffers")}
                </NavLink>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
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
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("common.dashboard")}
                  </NavLink>
                  
                  {isClient && (
                    <>
                      <NavLink
                        to="/my-requests"
                        className="block py-2 px-3 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t("common.myRequests")}
                      </NavLink>
                      <NavLink
                        to="/create-request"
                        className="block py-2 px-3 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t("common.createRequest")}
                      </NavLink>
                      <NavLink
                        to="/wallet"
                        className="block py-2 px-3 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t("common.wallet")}
                      </NavLink>
                      <NavLink
                        to="/profile"
                        className="block py-2 px-3 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
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
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t("common.travelRequests")}
                      </NavLink>
                      <NavLink
                        to="/my-offers"
                        className="block py-2 px-3 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t("common.myOffers")}
                      </NavLink>
                      <NavLink
                        to="/agency/profile"
                        className="block py-2 px-3 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
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
                        setIsMobileMenuOpen(false);
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
      </div>

      <div className="flex items-center space-x-4">
        {currentUser && (
          <>
            <LanguageSwitcher />
            
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 max-h-96 overflow-auto"
              >
                <div className="py-2 px-3 font-medium text-sm">
                  {t("common.notifications")}
                </div>
                <div className="border-t border-gray-200">
                  {notifications.length === 0 ? (
                    <div className="py-4 px-3 text-sm text-gray-500 text-center">
                      {t("common.noNotifications")}
                    </div>
                  ) : (
                    notifications
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className={`px-4 py-3 cursor-pointer ${
                            notification.isRead ? "" : "bg-muted/50"
                          }`}
                          onClick={() =>
                            handleNotificationClick(notification.id)
                          }
                        >
                          <div>
                            <div className="font-medium text-sm">
                              {notification.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {notification.message}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString("fr-FR", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                  aria-label="User menu"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline-block">
                    {currentUser.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <span className="text-sm text-muted-foreground">
                    {t("common.signedInAs")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <span className="text-sm font-medium">
                    {currentUser.email}
                  </span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate(isClient ? "/profile" : "/agency/profile")}>
                  <Settings className="h-4 w-4 mr-2" />
                  {t("common.profile")}
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("common.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </nav>
  );
}

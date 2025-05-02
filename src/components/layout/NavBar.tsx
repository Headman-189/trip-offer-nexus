
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const { getUserNotifications, markNotificationAsRead } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(
    currentUser ? getUserNotifications(currentUser.id) : []
  );

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
      title: "Logged out",
      description: "You have been successfully logged out",
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
        <NavLink to="/" className="flex items-center">
          <span className="text-xl font-semibold text-brand-800">
            TripOfferNexus
          </span>
        </NavLink>

        {currentUser && (
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              end
            >
              Dashboard
            </NavLink>

            {isClient && (
              <>
                <NavLink
                  to="/my-requests"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  My Requests
                </NavLink>
                <NavLink
                  to="/create-request"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  New Request
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
                  Travel Requests
                </NavLink>
                <NavLink
                  to="/my-offers"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  My Offers
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {currentUser && (
          <>
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
                  Notifications
                </div>
                <div className="border-t border-gray-200">
                  {notifications.length === 0 ? (
                    <div className="py-4 px-3 text-sm text-gray-500 text-center">
                      No notifications
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
                              ).toLocaleDateString("en-US", {
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
                    Signed in as{" "}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <span className="text-sm font-medium">
                    {currentUser.email}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </nav>
  );
}

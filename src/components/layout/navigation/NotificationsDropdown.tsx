
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useData } from "@/contexts/DataContext";

interface NotificationsDropdownProps {
  userId: string;
}

export default function NotificationsDropdown({ userId }: NotificationsDropdownProps) {
  const { t } = useTranslation();
  const { getUserNotifications, markNotificationAsRead } = useData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      const userNotifications = getUserNotifications(userId);
      setNotifications(userNotifications);
      setUnreadCount(
        userNotifications.filter((notification) => !notification.isRead).length
      );
    }
  }, [userId, getUserNotifications]);

  const handleNotificationClick = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
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
  );
}

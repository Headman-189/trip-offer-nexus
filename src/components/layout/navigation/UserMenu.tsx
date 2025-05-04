
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  userName: string;
  userEmail: string;
  isClient: boolean;
  handleLogout: () => void;
}

export default function UserMenu({ userName, userEmail, isClient, handleLogout }: UserMenuProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
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
            {userName}
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
            {userEmail}
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
  );
}

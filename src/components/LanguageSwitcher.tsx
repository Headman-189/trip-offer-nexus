
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { t } = useTranslation();

  return (
    <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
      <Globe className="h-4 w-4" />
      <span className="sr-only">{t('common.language')}</span>
    </Button>
  );
};

export default LanguageSwitcher;

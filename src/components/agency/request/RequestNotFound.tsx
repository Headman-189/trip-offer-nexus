
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export const RequestNotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in text-center py-12">
      <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
      <h2 className="mt-4 text-2xl font-bold">{t("common.requestNotFound")}</h2>
      <p className="mt-2 text-muted-foreground">
        {t("common.requestNotFoundDescription")}
      </p>
      <Button 
        className="mt-6"
        onClick={() => navigate("/requests")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> {t("common.backToRequests")}
      </Button>
    </div>
  );
};

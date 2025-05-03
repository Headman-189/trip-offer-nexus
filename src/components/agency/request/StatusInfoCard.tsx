
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export const StatusInfoCard = () => {
  const { t } = useTranslation();
  
  return (
    <Card className="bg-muted/30">
      <CardContent className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">{t("common.fulfilled")}</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          {t("common.fulfilledDescription")}
        </p>
      </CardContent>
    </Card>
  );
};

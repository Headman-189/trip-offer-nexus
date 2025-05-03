
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import PdfUploader from "@/components/upload/PdfUploader";

interface TicketUploaderProps {
  onUploadComplete: (fileUrl: string) => Promise<void>;
  isUploading: boolean;
  onCancel: () => void;
}

export const TicketUploader = ({
  onUploadComplete,
  isUploading,
  onCancel
}: TicketUploaderProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <PdfUploader
        onUploadComplete={onUploadComplete}
        isUploading={isUploading}
      />
      
      <DialogFooter className="gap-2 sm:gap-0 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {t("common.cancel")}
        </Button>
      </DialogFooter>
    </div>
  );
};

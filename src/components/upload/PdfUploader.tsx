
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilePdf, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface PdfUploaderProps {
  onFileUploaded: (fileUrl: string) => void;
  className?: string;
}

const PdfUploader = ({ onFileUploaded, className }: PdfUploaderProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: t("upload.error"),
        description: t("upload.onlyPdf"),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    // Simulate upload process
    setTimeout(() => {
      // In a real app, you would upload to a server and get a URL
      const mockPdfUrl = `pdf-${Date.now()}-${file.name}`;
      
      setIsUploading(false);
      toast({
        title: t("upload.success"),
        description: file.name,
      });
      
      onFileUploaded(mockPdfUrl);
    }, 1500);
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("pdf-upload")?.click()}
      >
        <input
          type="file"
          id="pdf-upload"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          {fileName ? (
            <div className="flex items-center space-x-2">
              <FilePdf className="h-8 w-8 text-red-500" />
              <span className="font-medium truncate max-w-[200px]">{fileName}</span>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-lg font-medium">{t("upload.drag")}</p>
              <p className="text-sm text-muted-foreground">{t("upload.or")}</p>
              <Button variant="outline" disabled={isUploading}>
                {t("upload.browse")}
              </Button>
            </>
          )}
          
          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full animate-pulse w-3/4"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{t("upload.uploading")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfUploader;

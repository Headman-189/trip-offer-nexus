
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface PdfUploaderProps {
  onUploadComplete: (fileUrl: string) => void;
  isUploading?: boolean;
}

const PdfUploader = ({ onUploadComplete, isUploading = false }: PdfUploaderProps) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Vérifier que le fichier est un PDF
      if (selectedFile.type !== "application/pdf") {
        setError(t("upload.onlyPdf"));
        toast({
          title: t("common.error"),
          description: t("upload.onlyPdf"),
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
      
      // Créer une URL d'aperçu
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-primary");
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Vérifier que le fichier est un PDF
      if (droppedFile.type !== "application/pdf") {
        setError(t("upload.onlyPdf"));
        toast({
          title: t("common.error"),
          description: t("upload.onlyPdf"),
          variant: "destructive",
        });
        return;
      }
      
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setError("");
      
      // Créer une URL d'aperçu
      const objectUrl = URL.createObjectURL(droppedFile);
      setPreviewUrl(objectUrl);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simuler le téléchargement avec un délai progressif
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(timer);
          return 95;
        }
        return prev + 5;
      });
    }, 150);
    
    try {
      // Simuler une requête de téléversement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Générer une URL fictive pour le PDF
      const mockPdfUrl = `https://example.com/uploads/${Date.now()}_${fileName.replace(/\s+/g, '_')}`;
      
      clearInterval(timer);
      setUploadProgress(100);
      
      // Attendre un peu avant de signaler que c'est terminé
      setTimeout(() => {
        onUploadComplete(mockPdfUrl);
        setUploading(false);
        toast({
          title: t("upload.success"),
          description: fileName,
        });
      }, 500);
    } catch (error) {
      clearInterval(timer);
      setUploading(false);
      setError(t("upload.error"));
      toast({
        title: t("common.error"),
        description: t("upload.error"),
        variant: "destructive",
      });
    }
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {!file && !uploading ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors"
          onClick={handleBrowseClick}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-12 w-12 text-gray-400" />
            <p className="text-lg font-medium">{t("upload.selectFile")}</p>
            <p className="text-sm text-muted-foreground">
              {t("upload.drag")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("upload.or")}
            </p>
            <Button type="button" variant="secondary" onClick={handleBrowseClick}>
              {t("upload.browse")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
          {fileName ? (
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-red-500" />
              <span className="font-medium truncate max-w-[200px]">{fileName}</span>
            </div>
          ) : (
            <FileText className="h-8 w-8 text-gray-400" />
          )}
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          
          <div className="flex space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setFileName("");
                setPreviewUrl("");
                setError("");
                setUploadProgress(0);
              }}
              disabled={uploading || isUploading}
            >
              {t("common.cancel")}
            </Button>
            
            {file && !uploading && (
              <Button
                onClick={handleUpload}
                disabled={uploading || isUploading}
              >
                {uploading ? t("upload.uploading") : t("upload.upload")}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;

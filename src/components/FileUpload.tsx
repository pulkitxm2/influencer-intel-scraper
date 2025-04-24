
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { parseSheetData } from "@/lib/sheetParser";
import { useToast } from "@/components/ui/use-toast";
import { Influencer } from "@/types";

interface FileUploadProps {
  onUpload: (influencers: Influencer[]) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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

    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;
    
    setFile(file);
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType !== 'csv' && fileType !== 'xlsx' && fileType !== 'xls') {
      toast({
        title: "Invalid file type",
        description: "Please upload a Google Sheet file (.csv, .xlsx, .xls)",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const influencers = await parseSheetData(file);
      onUpload(influencers);
      toast({
        title: "Sheet uploaded successfully",
        description: `Found ${influencers.length} influencer profiles`,
      });
    } catch (error) {
      console.error("Error parsing file:", error);
      toast({
        title: "Error parsing sheet",
        description: "Please check the file format and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-muted p-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Upload your Google Sheet</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your exported Google Sheet, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            First column should contain YouTube or Instagram profile URLs
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="file"
            accept=".csv, .xls, .xlsx"
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
          />
          <Button asChild>
            <label htmlFor="file-upload">Browse files</label>
          </Button>
        </div>
        {file && (
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}
      </div>
    </div>
  );
}

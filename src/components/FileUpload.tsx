
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { parseSheetData } from "@/lib/sheetParser";
import { useToast } from "@/components/ui/use-toast";
import { Influencer } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { fetchGoogleSheetData } from "@/lib/googleSheetParser";

interface FileUploadProps {
  onUpload: (influencers: Influencer[]) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType !== 'csv' && fileType !== 'xlsx' && fileType !== 'xls') {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const influencers = await parseSheetData(file);
      onUpload(influencers);
      toast({
        title: "File uploaded successfully",
        description: `Found ${influencers.length} influencer profiles`,
      });
    } catch (error) {
      console.error("Error parsing file:", error);
      toast({
        title: "Error parsing file",
        description: "Please check the file format and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSheetUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetUrl) {
      toast({
        title: "No URL provided",
        description: "Please enter a Google Sheet URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Validate if it's a Google Sheet URL
      if (!sheetUrl.includes("docs.google.com/spreadsheets")) {
        throw new Error("Invalid Google Sheet URL");
      }

      const influencers = await fetchGoogleSheetData(sheetUrl);
      onUpload(influencers);
      toast({
        title: "Sheet data fetched successfully",
        description: `Found ${influencers.length} influencer profiles`,
      });
    } catch (error) {
      console.error("Error fetching sheet data:", error);
      toast({
        title: "Error fetching sheet data",
        description: error instanceof Error ? error.message : "Please check the URL and sheet permissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="file" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="file">Upload File</TabsTrigger>
        <TabsTrigger value="url">Google Sheet URL</TabsTrigger>
      </TabsList>
      
      <TabsContent value="file">
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
              <h3 className="text-lg font-semibold">Upload your influencer sheet</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your CSV or Excel file, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                File should contain URLs to Instagram or YouTube profiles (one URL per row)
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".csv, .xls, .xlsx"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <Button asChild disabled={isLoading}>
                <label htmlFor="file-upload">{isLoading ? "Loading..." : "Browse files"}</label>
              </Button>
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="url">
        <Card>
          <CardHeader>
            <CardTitle>Google Sheet URL</CardTitle>
            <CardDescription>
              Enter the URL of a Google Sheet containing influencer profile links (one URL per row)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSheetUrlSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sheet-url">Sheet URL</Label>
                <Input
                  id="sheet-url"
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Make sure the sheet is publicly accessible or shared with "Anyone with the link"
                </p>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Fetch Data"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

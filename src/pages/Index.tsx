
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { InfluencerList } from "@/components/InfluencerList";
import { Influencer, InfluencerMetrics, SheetData } from "@/types";
import { processInfluencer } from "@/lib/influencerScraper";
import { exportToCSV } from "@/lib/exportData";
import { Download } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [data, setData] = useState<SheetData>({
    influencers: [],
    metrics: {}
  });
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  const handleUpload = (influencers: Influencer[]) => {
    setData({
      influencers,
      metrics: {}
    });
  };

  const handleProcess = async (influencer: Influencer) => {
    try {
      // Update influencer status to processing
      setData(prev => ({
        ...prev,
        influencers: prev.influencers.map(inf => 
          inf.id === influencer.id ? { ...inf, isProcessing: true, error: undefined } : inf
        )
      }));

      // Process the influencer
      const metrics = await processInfluencer(influencer);

      // Update with the results
      setData(prev => ({
        influencers: prev.influencers.map(inf => 
          inf.id === influencer.id ? { ...inf, isProcessed: true, isProcessing: false } : inf
        ),
        metrics: {
          ...prev.metrics,
          [influencer.id]: metrics
        }
      }));

      toast({
        title: "Processing complete",
        description: `Successfully processed ${influencer.username}'s profile`,
      });
    } catch (error) {
      console.error("Error processing influencer:", error);
      
      // Update with error
      setData(prev => ({
        ...prev,
        influencers: prev.influencers.map(inf => 
          inf.id === influencer.id ? { 
            ...inf, 
            isProcessing: false, 
            error: error instanceof Error ? error.message : "Unknown error" 
          } : inf
        )
      }));

      toast({
        title: "Processing failed",
        description: `Failed to process ${influencer.username}'s profile`,
        variant: "destructive",
      });
    }
  };

  const handleProcessAll = async () => {
    if (isProcessingAll) return;
    
    setIsProcessingAll(true);
    const unprocessedInfluencers = data.influencers.filter(inf => !inf.isProcessed && !inf.isProcessing);
    
    toast({
      title: "Batch processing started",
      description: `Processing ${unprocessedInfluencers.length} influencer profiles`,
    });

    let successCount = 0;
    let errorCount = 0;

    for (const influencer of unprocessedInfluencers) {
      try {
        // Update status to processing
        setData(prev => ({
          ...prev,
          influencers: prev.influencers.map(inf => 
            inf.id === influencer.id ? { ...inf, isProcessing: true, error: undefined } : inf
          )
        }));

        // Process the influencer with a small delay between each to avoid rate limits
        const metrics = await processInfluencer(influencer);
        successCount++;

        // Update with the results
        setData(prev => ({
          influencers: prev.influencers.map(inf => 
            inf.id === influencer.id ? { ...inf, isProcessed: true, isProcessing: false } : inf
          ),
          metrics: {
            ...prev.metrics,
            [influencer.id]: metrics
          }
        }));
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error processing influencer:", influencer.username, error);
        errorCount++;
        
        // Update with error
        setData(prev => ({
          ...prev,
          influencers: prev.influencers.map(inf => 
            inf.id === influencer.id ? { 
              ...inf, 
              isProcessing: false, 
              error: error instanceof Error ? error.message : "Unknown error" 
            } : inf
          )
        }));
      }
    }

    setIsProcessingAll(false);
    
    toast({
      title: "Batch processing complete",
      description: `Successfully processed ${successCount} profiles with ${errorCount} errors`,
      variant: errorCount > 0 ? "default" : "default",
    });
  };

  const handleExport = () => {
    if (data.influencers.length === 0) {
      toast({
        title: "No data to export",
        description: "Please upload and process influencer data first",
        variant: "destructive",
      });
      return;
    }
    
    const processedCount = data.influencers.filter(inf => inf.isProcessed).length;
    if (processedCount === 0) {
      toast({
        title: "No processed data",
        description: "Please process at least one influencer before exporting",
        variant: "destructive",
      });
      return;
    }
    
    exportToCSV(data.influencers, data.metrics);
    
    toast({
      title: "Export successful",
      description: `Exported data for ${processedCount} influencers`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Influencer Intel</h1>
            <p className="text-muted-foreground">
              Analyze influencer metrics across Instagram and YouTube
            </p>
          </div>
          
          <Button onClick={handleExport} disabled={data.influencers.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {data.influencers.length === 0 ? (
            <FileUpload onUpload={handleUpload} />
          ) : (
            <InfluencerList 
              influencers={data.influencers}
              metrics={data.metrics}
              onProcess={handleProcess}
              onProcessAll={handleProcessAll}
              isProcessingAll={isProcessingAll}
            />
          )}
        </div>
      </main>
      
      <footer className="border-t bg-muted/40">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Influencer Intel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

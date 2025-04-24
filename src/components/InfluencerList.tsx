
import { useState } from "react";
import { Influencer, InfluencerMetrics } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Youtube, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { InfluencerMetricsView } from "./InfluencerMetricsView";

interface InfluencerListProps {
  influencers: Influencer[];
  metrics: Record<string, InfluencerMetrics>;
  onProcess: (influencer: Influencer) => void;
  onProcessAll: () => void;
  isProcessingAll: boolean;
}

export function InfluencerList({
  influencers,
  metrics,
  onProcess,
  onProcessAll,
  isProcessingAll,
}: InfluencerListProps) {
  const [selectedInfluencer, setSelectedInfluencer] = useState<string | null>(null);

  const getProcessedCount = () => {
    return influencers.filter(inf => inf.isProcessed).length;
  };

  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderStatusIcon = (influencer: Influencer) => {
    if (influencer.error) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    if (influencer.isProcessed) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    if (influencer.isProcessing) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Influencers</h2>
          <p className="text-sm text-muted-foreground">
            {getProcessedCount()} of {influencers.length} processed
          </p>
        </div>
        <Button 
          onClick={onProcessAll} 
          disabled={isProcessingAll || influencers.length === 0 || getProcessedCount() === influencers.length}
        >
          {isProcessingAll ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process All"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {influencers.map((influencer) => (
            <Card 
              key={influencer.id}
              className={`cursor-pointer transition-all ${
                selectedInfluencer === influencer.id 
                  ? "border-brand-500 shadow-md" 
                  : "hover:border-brand-300"
              }`}
              onClick={() => setSelectedInfluencer(influencer.id)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {renderPlatformIcon(influencer.platform)}
                    <CardTitle className="text-base font-medium">
                      {influencer.username || "Unknown"}
                    </CardTitle>
                  </div>
                  {renderStatusIcon(influencer)}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                    {influencer.profileUrl}
                  </p>
                  {!influencer.isProcessed && !influencer.isProcessing && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProcess(influencer);
                      }}
                    >
                      Process
                    </Button>
                  )}
                </div>
                {influencer.error && (
                  <p className="text-xs text-destructive mt-2">
                    {influencer.error}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
          
          {influencers.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
              <p className="text-muted-foreground">
                No influencers uploaded yet. Upload a sheet to begin.
              </p>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          {selectedInfluencer ? (
            <InfluencerMetricsView 
              influencer={influencers.find(i => i.id === selectedInfluencer)!}
              metrics={metrics[selectedInfluencer]}
            />
          ) : (
            <Card className="h-full flex items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">
                Select an influencer to view their metrics
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


import { Influencer, InfluencerMetrics } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Instagram, Youtube, Users, Eye, Globe, Speech, DollarSign, MapPin, AlertCircle } from "lucide-react";

interface InfluencerMetricsViewProps {
  influencer: Influencer;
  metrics?: InfluencerMetrics;
}

export function InfluencerMetricsView({ influencer, metrics }: InfluencerMetricsViewProps) {
  const renderPlatformIcon = () => {
    switch (influencer.platform) {
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case "youtube":
        return <Youtube className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Format large numbers with k, M suffix
  const formatNumber = (num?: number) => {
    if (num === undefined) return "N/A";
    if (num < 1000) return num;
    if (num < 1000000) return `${(num / 1000).toFixed(1)}k`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  // For loading state when metrics are being processed
  const isLoading = influencer.isProcessing || (!metrics && !influencer.error);

  // Gender split data for pie chart
  const genderData = metrics?.genderSplit ? [
    { name: 'Male', value: metrics.genderSplit.male, color: '#7c4dff' },
    { name: 'Female', value: metrics.genderSplit.female, color: '#ff49db' },
    { name: 'Other', value: metrics.genderSplit.other, color: '#00b8d9' }
  ] : [];

  // Age split data for bar chart
  const ageData = metrics?.ageSplit ? Object.entries(metrics.ageSplit).map(([age, value]) => ({
    age,
    value
  })) : [];

  // State split data
  const stateData = metrics?.stateSplit ? 
    Object.entries(metrics.stateSplit)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([state, value]) => ({
        state,
        value: (value * 100).toFixed(1)
      })) 
    : [];

  return (
    <Card className="h-full">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {renderPlatformIcon()}
            <CardTitle>{influencer.username || "Unknown"}</CardTitle>
          </div>
          <a 
            href={influencer.profileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-brand-500 hover:underline"
          >
            View Profile
          </a>
        </div>
      </CardHeader>
      
      {influencer.error ? (
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-destructive font-medium">Error Processing Profile</p>
            <p className="text-sm text-muted-foreground mt-2">{influencer.error}</p>
          </div>
        </CardContent>
      ) : isLoading ? (
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse-slow">
                <CardContent className="p-4">
                  <div className="h-12 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="h-64 bg-muted rounded animate-pulse-slow" />
        </CardContent>
      ) : (
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Followers</p>
                  <p className="text-2xl font-bold">{formatNumber(metrics?.followerCount)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="rounded-full bg-amber-500/10 p-3">
                  <Eye className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Views</p>
                  <p className="text-2xl font-bold">{formatNumber(metrics?.avgViews)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="rounded-full bg-green-500/10 p-3">
                  <Globe className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Reach</p>
                  <p className="text-2xl font-bold">{formatNumber(metrics?.avgReach)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <Speech className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Language</p>
                  <p className="text-2xl font-bold">{metrics?.contentLanguage || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="rounded-full bg-purple-500/10 p-3">
                  <MapPin className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-2xl font-bold">{metrics?.location || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="rounded-full bg-rose-500/10 p-3">
                  <DollarSign className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Branded Views</p>
                  <p className="text-2xl font-bold">{formatNumber(metrics?.avgBrandedViews)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="demographics">
            <TabsList className="mb-4">
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demographics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Gender Split</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 h-64">
                    {genderData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genderData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${(value * 100).toFixed(0)}%`}
                          >
                            {genderData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No gender data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Age Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 h-64">
                    {ageData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageData}>
                          <XAxis dataKey="age" />
                          <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                          <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
                          <Bar dataKey="value" fill="#7c4dff" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No age data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="geography">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Top Locations</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {stateData.length > 0 ? (
                    <div className="space-y-4">
                      {stateData.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.state}</span>
                            <span className="font-medium">{item.value}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-500 rounded-full" 
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-muted-foreground">No location data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Influencer, InfluencerMetrics } from "@/types";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertCircle, MapPin, Users, Video, Eye, TrendingUp } from 'lucide-react';

interface InfluencerMetricsViewProps {
  influencer: Influencer;
  metrics: InfluencerMetrics | undefined;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6B6B'];

export function InfluencerMetricsView({ influencer, metrics }: InfluencerMetricsViewProps) {
  if (!metrics) {
    if (influencer.isProcessed) {
      return (
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              {influencer.username}'s Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No metrics data available for this influencer.</p>
              {influencer.error && (
                <p className="text-sm text-destructive mt-2">{influencer.error}</p>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            {influencer.username}'s Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground">
              Process this influencer to view their metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const genderData = metrics.genderSplit ? [
    { name: 'Male', value: metrics.genderSplit.male },
    { name: 'Female', value: metrics.genderSplit.female },
    { name: 'Other', value: metrics.genderSplit.other }
  ] : [];

  const ageData = metrics.ageSplit ? [
    { name: '13-17', value: metrics.ageSplit['13-17'] },
    { name: '18-24', value: metrics.ageSplit['18-24'] },
    { name: '25-34', value: metrics.ageSplit['25-34'] },
    { name: '35-44', value: metrics.ageSplit['35-44'] },
    { name: '45-54', value: metrics.ageSplit['45-54'] },
    { name: '55+', value: metrics.ageSplit['55+'] }
  ] : [];

  const stateData = metrics.stateSplit 
    ? Object.entries(metrics.stateSplit)
        .map(([state, value]) => ({ name: state, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5) // Only show top 5 states
    : [];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          {influencer.username}'s Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            icon={<Users className="h-4 w-4" />}
            title="Followers"
            value={metrics.followerCount?.toLocaleString() || 'N/A'}
          />
          <StatCard 
            icon={<MapPin className="h-4 w-4" />}
            title="Location"
            value={metrics.location || 'N/A'}
          />
          <StatCard 
            icon={<Video className="h-4 w-4" />}
            title="Content Language"
            value={metrics.contentLanguage || 'N/A'}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            icon={<Eye className="h-4 w-4" />}
            title="Avg. Views"
            value={metrics.avgViews?.toLocaleString() || 'N/A'}
          />
          <StatCard 
            icon={<TrendingUp className="h-4 w-4" />}
            title="Avg. Reach"
            value={metrics.avgReach?.toLocaleString() || 'N/A'}
          />
          <StatCard 
            icon={<Eye className="h-4 w-4" />}
            title="Avg. Branded Views"
            value={metrics.avgBrandedViews?.toLocaleString() || 'N/A'}
          />
        </div>
        
        <Tabs defaultValue="demographics" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="age">Age Distribution</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographics" className="pt-4">
            {genderData.length > 0 ? (
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium mb-4">Gender Distribution</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No demographic data available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="age" className="pt-4">
            {ageData.length > 0 ? (
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium mb-4">Age Distribution</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageData}>
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${Number(value).toFixed(0)}%`} />
                      <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                      <Bar dataKey="value" fill="#8884d8">
                        {ageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No age data available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="location" className="pt-4">
            {stateData.length > 0 ? (
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium mb-4">Top Locations</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={stateData}>
                      <XAxis type="number" tickFormatter={(value) => `${Number(value).toFixed(0)}%`} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                      <Bar dataKey="value" fill="#8884d8">
                        {stateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No location data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

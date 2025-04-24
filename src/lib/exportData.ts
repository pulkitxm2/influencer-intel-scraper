
import { Influencer, InfluencerMetrics } from "@/types";

export function exportToCSV(influencers: Influencer[], metrics: Record<string, InfluencerMetrics>): void {
  // Generate CSV content
  let csvContent = "Username,Platform,Followers,Avg Views,Avg Reach,Language,Location,Male %,Female %,Top Location\n";
  
  influencers.forEach(influencer => {
    if (!influencer.isProcessed) return;
    
    const metric = metrics[influencer.id];
    if (!metric) return;
    
    const row = [
      influencer.username,
      influencer.platform,
      metric.followerCount || 'N/A',
      metric.avgViews || 'N/A',
      metric.avgReach || 'N/A',
      metric.contentLanguage || 'N/A',
      metric.location || 'N/A',
      metric.genderSplit ? `${(metric.genderSplit.male * 100).toFixed(1)}%` : 'N/A',
      metric.genderSplit ? `${(metric.genderSplit.female * 100).toFixed(1)}%` : 'N/A',
      metric.stateSplit ? getTopLocation(metric.stateSplit) : 'N/A'
    ];
    
    csvContent += row.join(',') + '\n';
  });
  
  // Create a blob and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `influencer-data-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getTopLocation(stateSplit: Record<string, number>): string {
  const topState = Object.entries(stateSplit)
    .sort((a, b) => b[1] - a[1])[0];
  
  return `${topState[0]} (${(topState[1] * 100).toFixed(1)}%)`;
}

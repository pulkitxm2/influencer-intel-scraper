
export type Platform = 'instagram' | 'youtube';

export interface Influencer {
  id: string;
  name: string;
  profileUrl: string;
  platform: Platform;
  username: string;
  isProcessed: boolean;
  isProcessing: boolean;
  error?: string;
}

export interface InfluencerMetrics {
  id: string;
  followerCount?: number;
  location?: string;
  contentLanguage?: string;
  avgViews?: number;
  avgReach?: number;
  avgBrandedViews?: number;
  genderSplit?: {
    male: number;
    female: number;
    other: number;
  };
  stateSplit?: Record<string, number>;
  ageSplit?: {
    '13-17': number;
    '18-24': number;
    '25-34': number;
    '35-44': number;
    '45-54': number;
    '55+': number;
  };
}

export interface SheetData {
  influencers: Influencer[];
  metrics: Record<string, InfluencerMetrics>;
}

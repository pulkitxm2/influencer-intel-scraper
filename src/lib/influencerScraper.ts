
import { Influencer, InfluencerMetrics } from "@/types";

export async function processInfluencer(influencer: Influencer): Promise<InfluencerMetrics> {
  try {
    // In a real application, this would be an API call to a backend service
    // that performs the actual web scraping. For this demo, we'll simulate
    // an API call to a scraping service.
    const apiEndpoint = `https://api.scrapingapi.io/?url=${encodeURIComponent(influencer.profileUrl)}`;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    // For demo purposes, we'll use platform-specific scraping simulation
    // In a real app, you would use a proper scraping API or service
    if (influencer.platform === 'instagram') {
      return scrapeInstagramProfile(influencer);
    } else if (influencer.platform === 'youtube') {
      return scrapeYoutubeProfile(influencer);
    }
    
    throw new Error("Unsupported platform");
  } catch (error) {
    console.error("Error in scraper:", error);
    throw new Error("Failed to access profile data");
  }
}

// Simulated Instagram scraping
function scrapeInstagramProfile(influencer: Influencer): InfluencerMetrics {
  // In a real scraper, these values would come from parsing the page HTML/JSON
  const username = influencer.username.toLowerCase();
  let followerBase = 10000;
  
  // Create somewhat deterministic but varying data based on username
  // This ensures the same profile always returns similar data
  const usernameHash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Determine follower count based on "popularity" of username
  if (username.length < 6) followerBase = 500000; // Short usernames tend to be more popular
  if (["official", "real", "the"].some(word => username.includes(word))) followerBase *= 1.5;
  
  const followerCount = Math.floor(followerBase + (usernameHash * 1000) % 5000000);
  
  // Generate other metrics based on follower count and username hash
  const metrics: InfluencerMetrics = {
    id: influencer.id,
    followerCount,
    location: getLocationBasedOnHash(usernameHash),
    contentLanguage: getLanguageBasedOnHash(usernameHash),
    avgViews: Math.floor(followerCount * (0.1 + (usernameHash % 20) / 100)),
    avgReach: Math.floor(followerCount * (0.15 + (usernameHash % 15) / 100)),
    avgBrandedViews: Math.floor(followerCount * (0.05 + (usernameHash % 10) / 100)),
    genderSplit: {
      male: 0.3 + (usernameHash % 40) / 100,
      female: 0,
      other: 0.05 + (usernameHash % 10) / 100
    },
    stateSplit: generateStateSplitBasedOnHash(usernameHash),
    ageSplit: {
      '13-17': 0.05 + (usernameHash % 15) / 100,
      '18-24': 0.25 + (usernameHash % 20) / 100,
      '25-34': 0.30 + (usernameHash % 15) / 100,
      '35-44': 0.15 + (usernameHash % 15) / 100,
      '45-54': 0.05 + (usernameHash % 10) / 100,
      '55+': 0
    }
  };
  
  // Calculate remaining percentages to sum to 1
  metrics.genderSplit.female = 1 - metrics.genderSplit.male - metrics.genderSplit.other;
  
  let ageSum = 0;
  Object.entries(metrics.ageSplit).forEach(([key, value]) => {
    if (key !== '55+') ageSum += value;
  });
  metrics.ageSplit['55+'] = Math.max(0, 1 - ageSum);
  
  return metrics;
}

// Simulated YouTube scraping
function scrapeYoutubeProfile(influencer: Influencer): InfluencerMetrics {
  // Similar approach as Instagram but with YouTube-specific tweaks
  const username = influencer.username.toLowerCase();
  let subscriberBase = 50000;
  
  const usernameHash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Determine subscriber count based on username characteristics
  if (["tech", "game", "tutorial", "how", "review"].some(word => username.includes(word))) {
    subscriberBase *= 2;
  }
  
  const followerCount = Math.floor(subscriberBase + (usernameHash * 2000) % 10000000);
  
  // YouTube specific metrics tend to differ from Instagram
  const metrics: InfluencerMetrics = {
    id: influencer.id,
    followerCount,
    location: getLocationBasedOnHash(usernameHash),
    contentLanguage: getLanguageBasedOnHash(usernameHash),
    avgViews: Math.floor(followerCount * (0.2 + (usernameHash % 30) / 100)), // YouTube often has higher view-to-sub ratio
    avgReach: Math.floor(followerCount * (0.25 + (usernameHash % 20) / 100)),
    avgBrandedViews: Math.floor(followerCount * (0.15 + (usernameHash % 15) / 100)),
    genderSplit: {
      male: 0.55 + (usernameHash % 25) / 100, // YouTube often skews more male
      female: 0,
      other: 0.03 + (usernameHash % 7) / 100
    },
    stateSplit: generateStateSplitBasedOnHash(usernameHash),
    ageSplit: {
      '13-17': 0.12 + (usernameHash % 13) / 100,
      '18-24': 0.30 + (usernameHash % 15) / 100,
      '25-34': 0.25 + (usernameHash % 15) / 100,
      '35-44': 0.15 + (usernameHash % 10) / 100,
      '45-54': 0.05 + (usernameHash % 5) / 100,
      '55+': 0
    }
  };
  
  // Calculate remaining percentages
  metrics.genderSplit.female = 1 - metrics.genderSplit.male - metrics.genderSplit.other;
  
  let ageSum = 0;
  Object.entries(metrics.ageSplit).forEach(([key, value]) => {
    if (key !== '55+') ageSum += value;
  });
  metrics.ageSplit['55+'] = Math.max(0, 1 - ageSum);
  
  return metrics;
}

// Helper functions to generate consistent but varied data

function getLocationBasedOnHash(hash: number): string {
  const locations = [
    "United States", "United Kingdom", "Canada", "Australia", 
    "India", "Germany", "France", "Brazil", "Japan", "South Korea"
  ];
  return locations[hash % locations.length];
}

function getLanguageBasedOnHash(hash: number): string {
  const languages = [
    "English", "Spanish", "Hindi", "French", 
    "German", "Portuguese", "Japanese", "Korean"
  ];
  return languages[hash % languages.length];
}

function generateStateSplitBasedOnHash(hash: number): Record<string, number> {
  const states = {
    "California": 0.1 + (hash % 20) / 100,
    "New York": 0.08 + (hash % 15) / 100,
    "Texas": 0.07 + (hash % 15) / 100,
    "Florida": 0.06 + (hash % 12) / 100,
    "Illinois": 0.05 + (hash % 10) / 100,
    "Pennsylvania": 0.04 + (hash % 8) / 100,
    "Ohio": 0.03 + (hash % 6) / 100,
    "Georgia": 0.02 + (hash % 4) / 100,
    "North Carolina": 0.015 + (hash % 3) / 100,
    "Michigan": 0.01 + (hash % 2) / 100
  };
  
  // Normalize to sum to 1
  let total = 0;
  Object.values(states).forEach(value => total += value);
  
  const normalizedStates: Record<string, number> = {};
  Object.entries(states).forEach(([state, value]) => {
    normalizedStates[state] = value / total;
  });
  
  return normalizedStates;
}

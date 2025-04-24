
import { Influencer, InfluencerMetrics } from "@/types";

// This is a mock service that simulates scraping/API calls
// In a real application, you would implement actual web scraping or API calls
export async function processInfluencer(influencer: Influencer): Promise<InfluencerMetrics> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  
  // Randomly fail some requests to show error handling
  if (Math.random() < 0.1) {
    throw new Error("Failed to access profile data");
  }
  
  // Generate mock data based on the platform
  const metrics: InfluencerMetrics = {
    id: influencer.id,
    followerCount: Math.floor(10000 + Math.random() * 990000),
    location: randomLocation(),
    contentLanguage: randomLanguage(),
    avgViews: Math.floor(5000 + Math.random() * 95000),
    avgReach: Math.floor(7000 + Math.random() * 93000),
    avgBrandedViews: Math.floor(3000 + Math.random() * 47000),
    genderSplit: {
      male: Math.random() * 0.6 + 0.2, // 20-80%
      female: 0, // Will be calculated below
      other: Math.random() * 0.1 // 0-10%
    },
    stateSplit: generateStateSplit(),
    ageSplit: {
      '13-17': Math.random() * 0.15,
      '18-24': Math.random() * 0.3,
      '25-34': Math.random() * 0.3,
      '35-44': Math.random() * 0.2,
      '45-54': Math.random() * 0.1,
      '55+': 0 // Will be calculated below to sum to 1
    }
  };
  
  // Calculate remaining percentages to sum to 1
  metrics.genderSplit!.female = 1 - metrics.genderSplit!.male - metrics.genderSplit!.other;
  
  let ageSum = 0;
  Object.entries(metrics.ageSplit!).forEach(([key, value]) => {
    if (key !== '55+') ageSum += value;
  });
  metrics.ageSplit!['55+'] = Math.max(0, 1 - ageSum);
  
  // Adjust values based on platform
  if (influencer.platform === 'youtube') {
    metrics.followerCount = Math.floor(metrics.followerCount! * 1.5); // YouTube channels tend to have more subscribers
    metrics.avgViews = Math.floor(metrics.avgViews! * 0.8); // But slightly lower engagement
    metrics.contentLanguage = 'English'; // Assume English for demo
  } else if (influencer.platform === 'instagram') {
    metrics.avgReach = Math.floor(metrics.avgReach! * 1.2); // Instagram often has higher reach
  }
  
  return metrics;
}

function randomLocation(): string {
  const locations = [
    "United States", "United Kingdom", "Canada", "Australia", 
    "India", "Germany", "France", "Brazil", "Japan", "South Korea"
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function randomLanguage(): string {
  const languages = [
    "English", "Spanish", "Hindi", "French", 
    "German", "Portuguese", "Japanese", "Korean"
  ];
  return languages[Math.floor(Math.random() * languages.length)];
}

function generateStateSplit(): Record<string, number> {
  const states = {
    "California": Math.random() * 0.3,
    "New York": Math.random() * 0.2,
    "Texas": Math.random() * 0.15,
    "Florida": Math.random() * 0.15,
    "Illinois": Math.random() * 0.1,
    "Pennsylvania": Math.random() * 0.08,
    "Ohio": Math.random() * 0.07,
    "Georgia": Math.random() * 0.06,
    "North Carolina": Math.random() * 0.05,
    "Michigan": Math.random() * 0.04
  };
  
  // Normalize to sum to 1
  const total = Object.values(states).reduce((sum, value) => sum + value, 0);
  
  const normalizedStates: Record<string, number> = {};
  Object.entries(states).forEach(([state, value]) => {
    normalizedStates[state] = value / total;
  });
  
  return normalizedStates;
}

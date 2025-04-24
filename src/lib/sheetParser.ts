import { v4 as uuidv4 } from 'uuid';
import { Influencer } from "@/types";

export async function parseSheetData(file: File): Promise<Influencer[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error("Failed to read file"));
          return;
        }

        let influencers: Influencer[] = [];
        
        if (file.name.endsWith('.csv')) {
          influencers = parseCSV(data as string);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // Mock Excel parsing for now - in a real app we'd use a library
          // like SheetJS (xlsx) to parse Excel files
          influencers = mockParseExcel(data as string);
        }

        resolve(influencers);
      } catch (error) {
        console.error("Error parsing file:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsText(file); // Just for demo, would be readAsArrayBuffer for Excel
    }
  });
}

function parseCSV(csvData: string): Influencer[] {
  const lines = csvData.split('\n');
  if (lines.length <= 1) {
    throw new Error("CSV file appears to be empty or only contains headers");
  }
  
  // Look for URLs in the first column
  const influencers: Influencer[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const url = line.split(',')[0]?.trim();
    if (url && (url.includes('youtube.com') || url.includes('instagram.com'))) {
      const influencer = createInfluencerFromURL(url);
      if (influencer) {
        influencers.push(influencer);
      }
    }
  }
  
  return influencers;
}

function mockParseExcel(data: string): Influencer[] {
  // For Excel files, we'll just process the first column as URLs
  const lines = data.split('\n');
  const influencers: Influencer[] = [];
  
  for (const line of lines) {
    const url = line.trim();
    if (url && (url.includes('youtube.com') || url.includes('instagram.com'))) {
      const influencer = createInfluencerFromURL(url);
      if (influencer) {
        influencers.push(influencer);
      }
    }
  }
  
  return influencers;
}

export function createInfluencerFromURL(url: string): Influencer | null {
  try {
    const urlObj = new URL(url.replace(/\/$/, ''));
    const hostname = urlObj.hostname;
    let platform: 'instagram' | 'youtube' = 'instagram';
    let username = '';
    
    if (hostname.includes('instagram.com')) {
      platform = 'instagram';
      // Get username from path, e.g., /username
      username = urlObj.pathname.split('/').filter(Boolean)[0] || '';
    } else if (hostname.includes('youtube.com')) {
      platform = 'youtube';
      if (urlObj.pathname.startsWith('/c/') || urlObj.pathname.startsWith('/channel/')) {
        username = urlObj.pathname.split('/').filter(Boolean)[1] || '';
      } else if (urlObj.pathname.startsWith('/@')) {
        username = urlObj.pathname.substring(2); // Remove the '@'
      } else {
        username = urlObj.pathname.split('/').filter(Boolean)[0] || '';
      }
    } else {
      return null; // Not a supported platform
    }
    
    return {
      id: uuidv4(),
      name: username, // Use username as name initially
      username,
      profileUrl: url,
      platform,
      isProcessed: false,
      isProcessing: false
    };
  } catch (error) {
    console.error("Error parsing URL:", url, error);
    return null;
  }
}


import { Influencer } from "@/types";
import { v4 as uuidv4 } from 'uuid';

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
  
  const influencers: Influencer[] = [];
  
  // Process each line as a potential URL
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Try to extract a URL from the line
    const url = line.split(',')[0].trim();
    
    // Skip if it doesn't look like a URL
    if (!url.startsWith('http')) continue;
    
    const influencer = createInfluencerFromURL(url);
    if (influencer) {
      influencers.push(influencer);
    }
  }
  
  if (influencers.length === 0) {
    throw new Error("No valid influencer URLs found in the file");
  }
  
  return influencers;
}

// Mock function for Excel parsing in this demo
function mockParseExcel(data: string): Influencer[] {
  // For simplicity, we'll just parse it as CSV
  // In a real app, we'd use a library like SheetJS (xlsx)
  return parseCSV(data);
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
    
    if (!username) {
      console.error("Could not extract username from URL:", url);
      return null;
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

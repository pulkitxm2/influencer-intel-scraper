
import { createInfluencerFromURL } from "./sheetParser";
import { Influencer } from "@/types";

export async function fetchGoogleSheetData(sheetUrl: string): Promise<Influencer[]> {
  try {
    // Extract the sheet ID from the URL
    const urlParts = sheetUrl.split('/');
    const sheetIdIndex = urlParts.findIndex(part => part === 'd') + 1;
    
    if (sheetIdIndex >= urlParts.length) {
      throw new Error("Invalid Google Sheet URL format");
    }
    
    const sheetId = urlParts[sheetIdIndex];
    
    // Fetch the Google Sheet as CSV
    // This works because Google Sheets can be exported as CSV using this format
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }
    
    const csvData = await response.text();
    
    // Parse the CSV data
    const lines = csvData.split('\n');
    if (lines.length <= 1) {
      throw new Error("Sheet appears to be empty or only contains headers");
    }
    
    // Process each line as a potential URL
    const influencers: Influencer[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Try to extract a URL from the line
      // First, check if the entire line is a URL
      let url = line;
      
      // If the line contains commas (CSV format), take the first cell as the URL
      if (line.includes(',')) {
        url = line.split(',')[0].trim();
      }
      
      // Skip if it doesn't look like a URL
      if (!url.startsWith('http')) continue;
      
      // Create influencer object from the URL
      const influencer = createInfluencerFromURL(url);
      if (influencer) {
        influencers.push(influencer);
      }
    }
    
    if (influencers.length === 0) {
      throw new Error("No valid influencer URLs found in the sheet");
    }
    
    return influencers;
  } catch (error) {
    console.error("Error fetching Google Sheet data:", error);
    throw error;
  }
}

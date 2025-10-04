import Papa from 'papaparse';

export interface Paper {
  id: string;
  title: string;
  link: string;
  content: string;
  pdfLink: string;
}

// Google Sheets CSV URL - converted from the sharing link
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1bUYDRHaBekQVFvcqp5kv4XRXZ6M1HuUmHu76LADAUV0/export?format=csv';

// Cache for papers data
let cachedPapers: Paper[] | null = null;

/**
 * Fetches papers data from Google Sheets CSV
 */
export async function fetchPapersData(): Promise<Paper[]> {
  if (cachedPapers) {
    return cachedPapers;
  }

  try {
    // Add no-cors mode and cache control to handle potential CORS issues
    const response = await fetch(GOOGLE_SHEETS_CSV_URL, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          // Transform headers to match our interface
          const headerMap: { [key: string]: string } = {
            'Title': 'title',
            'Link': 'link', 
            'id': 'id',
            'content': 'content',
            'PDF Link': 'pdfLink'
          };
          return headerMap[header] || header.toLowerCase();
        },
        complete: (results) => {
          try {
            if (!results.data || results.data.length === 0) {
              console.warn('No data found in CSV');
              resolve([]);
              return;
            }

            const papers: Paper[] = results.data
              .filter((row: any) => row && (row.title || row.id)) // Filter out empty rows
              .map((row: any, index: number) => ({
                id: row.id || `paper-${index + 1}`,
                title: row.title || 'Untitled',
                link: row.link || '',
                content: row.content || '',
                pdfLink: row.pdfLink || row['PDF Link'] || row.pdflink || ''
              }));
            
            cachedPapers = papers;
            console.log(`Successfully loaded ${papers.length} papers from Google Sheets`);
            resolve(papers);
          } catch (error) {
            console.error('Error processing CSV data:', error);
            reject(error);
          }
        },
        error: (error: Error) => {
          console.error('Papa Parse error:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching papers data:', error);
    // Return fallback data from the local CSV if Google Sheets fails
    return getFallbackData();
  }
}

/**
 * Fallback data function to load from local CSV if Google Sheets fails
 */
async function getFallbackData(): Promise<Paper[]> {
  try {
    // Try to load the local CSV file as fallback
    const fallbackData: Paper[] = [
      {
        id: "ID00001",
        title: "Mice in Bion-M 1 space mission: training and selection",
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4136787/",
        content: "Research paper about mice experiments in the Bion-M 1 biosatellite mission focusing on biomedical research in space conditions.",
        pdfLink: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4136787/pdf/pone.0104830.pdf"
      },
      {
        id: "ID00002", 
        title: "Microgravity induces pelvic bone loss through osteoclastic activity, osteocytic osteolysis, and osteoblastic cell cycle inhibition by CDKN1a/p21",
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3630201/",
        content: "Study on bone loss mechanisms in microgravity conditions affecting osteoclasts, osteoblasts, and osteocytes.",
        pdfLink: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3630201/pdf/pone.0061372.pdf"
      },
      {
        id: "ID00003",
        title: "Stem Cell Health and Tissue Regeneration in Microgravity", 
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11988870/",
        content: "Comprehensive review on microgravity effects on stem cells, immune system, tissue regeneration, and cellular responses.",
        pdfLink: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11988870/pdf/ijms-26-03058.pdf"
      }
    ];
    console.log('Using fallback data due to Google Sheets access issues');
    return fallbackData;
  } catch (error) {
    console.error('Error loading fallback data:', error);
    return [];
  }
}

/**
 * Search papers by title, content, or ID
 */
export function searchPapers(papers: Paper[], query: string): Paper[] {
  if (!query.trim()) {
    return papers;
  }

  const lowercaseQuery = query.toLowerCase();
  
  return papers.filter(paper => 
    paper.title.toLowerCase().includes(lowercaseQuery) ||
    paper.content.toLowerCase().includes(lowercaseQuery) ||
    paper.id.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Clear the cache (useful for refreshing data)
 */
export function clearPapersCache(): void {
  cachedPapers = null;
}

import Papa from 'papaparse';

export interface Paper {
  id: string;
  title: string;
  link: string;
  content: string;
  pdfLink: string;
  images?: string;
  authors?: string;
}

// Google Sheets CSV URL - converted from the sharing link
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1bUYDRHaBekQVFvcqp5kv4XRXZ6M1HuUmHu76LADAUV0/export?format=csv';

// Cache for papers data
let cachedPapers: Paper[] | null = null;



/**
 * Fetches papers data from Google Sheets CSV
 */
export async function fetchPapersData(): Promise<Paper[]> {
  // Clear cache to force refresh for author data
  cachedPapers = null;
  
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
            'PDF Link': 'pdfLink',
            'Image': 'images',
            'Images': 'images',
            'image': 'images',
            'images': 'images',
            'Author': 'authors',
            'Authors': 'authors',
            'author': 'authors',
            'authors': 'authors'
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
                pdfLink: row.pdfLink || row['PDF Link'] || row.pdflink || '',
                images: row.images || row['Image'] || row['Images'] || row.image || '',
                authors: row.authors || row['Author'] || row['Authors'] || row.author || ''
              }));
            
            cachedPapers = papers;

            console.log(`Successfully loaded ${papers.length} papers from Google Sheets`);
            // Debug: Check if authors field is present in the first few papers
            const firstPaper = papers[0];
            if (firstPaper) {
              console.log('First paper authors field:', firstPaper.authors);
              console.log('Available fields:', Object.keys(firstPaper));
            }
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
 * Processes images string and extracts JPG image URLs
 */
export function processImageUrls(imagesString: string): string[] {
  if (!imagesString || typeof imagesString !== 'string') {
    return [];
  }
  
  // Split by " : " (space-colon-space) as found in the data format
  let allUrls: string[] = [];
  
  if (imagesString.includes(' : ')) {
    allUrls = imagesString.split(' : ');
  } else if (imagesString.includes(': ')) {
    allUrls = imagesString.split(': ');
  } else {
    allUrls = imagesString.split(':');
  }
  
  // Clean URLs and filter for HTTP URLs
  allUrls = allUrls
    .map(url => url.trim())
    .filter(url => url.length > 0 && url.startsWith('http'));
  
  // Filter for JPG/JPEG URLs
  const jpgUrls = allUrls.filter(url => /\.(jpg|jpeg)$/i.test(url));
  
  // Filter out non-research images and include research images
  const researchImages = jpgUrls.filter(url => {
    // Exclude flags, icons, logos, SVG data URLs
    if (url.includes('flag') || url.includes('icon') || url.includes('logo') || url.includes('data:image/svg')) return false;
    
    // Include NCBI PMC blob URLs (research images)
    if (url.includes('cdn.ncbi.nlm.nih.gov/pmc/blobs')) return true;
    
    // Include other research patterns
    if (url.includes('pmc') || url.includes('pubmed')) return true;
    
    // Include figure patterns (g001.jpg, fig01.jpg, figure1.jpg)
    if (url.match(/\.(g\d+|fig\d+|figure\d+)\.jpg$/i)) return true;
    
    return false;
  });
  
  return researchImages;
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
 * Parse authors string into array of author names
 */
export function parseAuthors(authorsString: string): string[] {
  if (!authorsString || typeof authorsString !== 'string') {
    return [];
  }
  
  return authorsString
    .split(',')
    .map(author => author.trim())
    .filter(author => author.length > 0);
}

/**
 * Format authors for display in preview cards (limit with +X more)
 */
export function formatAuthorsForPreview(authorsString: string, maxAuthors: number = 2): { displayAuthors: string; remainingCount: number } {
  const authors = parseAuthors(authorsString);
  
  if (authors.length === 0) {
    return { displayAuthors: '', remainingCount: 0 };
  }
  
  if (authors.length <= maxAuthors) {
    return { displayAuthors: authors.join(', '), remainingCount: 0 };
  }
  
  const displayAuthors = authors.slice(0, maxAuthors).join(', ');
  const remainingCount = authors.length - maxAuthors;
  
  return { displayAuthors, remainingCount };
}

/**
 * Get all authors as array for full page display
 */
export function getAllAuthors(authorsString: string): string[] {
  return parseAuthors(authorsString);
}

/**
 * Clear the cache (useful for refreshing data)
 */
export function clearPapersCache(): void {
  cachedPapers = null;
}

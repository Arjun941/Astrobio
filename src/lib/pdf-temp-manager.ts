import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

// Directory for temporary PDFs (inside the project to avoid permissions issues)
const TEMP_DIR = path.join(process.cwd(), 'tmp', 'pdfs');

// Map to track downloaded files for cleanup
const downloadedFiles = new Map<string, string>();

/**
 * Ensures the temp directory exists
 */
async function ensureTempDir(): Promise<void> {
  try {
    await fs.access(TEMP_DIR);
  } catch {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  }
}

/**
 * Downloads a PDF from URL and saves it temporarily
 */
export async function downloadPdfTemporarily(url: string): Promise<string> {
  // Check if we already have this file downloaded
  if (downloadedFiles.has(url)) {
    const filePath = downloadedFiles.get(url)!;
    try {
      await fs.access(filePath);
      return filePath; // File still exists, return it
    } catch {
      // File was deleted, remove from map and re-download
      downloadedFiles.delete(url);
    }
  }

  console.log(`Downloading PDF from: ${url}`);
  
  // Validate URL
  if (!url || url.trim() === '') {
    throw new Error("No PDF URL provided");
  }

  try {
    new URL(url);
  } catch {
    throw new Error("Invalid PDF URL format");
  }

  await ensureTempDir();

  // Generate unique filename
  const hash = crypto.createHash('md5').update(url).digest('hex');
  const fileName = `pdf_${hash}.pdf`;
  const filePath = path.join(TEMP_DIR, fileName);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/pdf,*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('pdf') && !contentType.includes('octet-stream')) {
      console.warn(`Content-Type is ${contentType}, not a PDF. Attempting to save anyway.`);
    }

    const arrayBuffer = await response.arrayBuffer();
    
    if (arrayBuffer.byteLength === 0) {
      throw new Error("PDF file is empty");
    }

    console.log(`PDF downloaded, size: ${arrayBuffer.byteLength} bytes`);

    // Write file to disk
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    
    // Track the file for cleanup
    downloadedFiles.set(url, filePath);
    
    console.log(`PDF saved to: ${filePath}`);
    return filePath;

  } catch (error) {
    console.error("Error downloading PDF:", error);
    
    if (error instanceof Error) {
      throw new Error(`Could not download PDF: ${error.message}`);
    }
    throw new Error("Could not download PDF: Unknown error");
  }
}

/**
 * Deletes a specific temporary PDF file
 */
export async function deleteTempPdf(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
    
    // Remove from tracking map
    for (const [url, path] of downloadedFiles.entries()) {
      if (path === filePath) {
        downloadedFiles.delete(url);
        break;
      }
    }
    
    console.log(`Deleted temporary PDF: ${filePath}`);
  } catch (error) {
    console.warn(`Could not delete temporary PDF ${filePath}:`, error);
  }
}

/**
 * Deletes all temporary PDF files
 */
export async function cleanupAllTempPdfs(): Promise<void> {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    for (const file of pdfFiles) {
      const filePath = path.join(TEMP_DIR, file);
      await deleteTempPdf(filePath);
    }
    
    downloadedFiles.clear();
    console.log(`Cleaned up ${pdfFiles.length} temporary PDF files`);
  } catch (error) {
    console.warn("Error during cleanup:", error);
  }
}

/**
 * Get the file path for a URL if it's already downloaded
 */
export function getTempPdfPath(url: string): string | null {
  return downloadedFiles.get(url) || null;
}

/**
 * Schedule cleanup after a delay (useful for session cleanup)
 */
export function scheduleCleanup(delayMs: number = 30 * 60 * 1000): void { // Default 30 minutes
  setTimeout(() => {
    cleanupAllTempPdfs();
  }, delayMs);
}
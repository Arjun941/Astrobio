import { GoogleGenerativeAI } from '@google/generative-ai';
import { fetchPapersData, searchPapers } from '@/lib/papers-data';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface RelatedPaper {
  id: string;
  title: string;
  link: string;
  relevanceScore: number;
  matchingKeywords: string[];
}

interface Citation {
  paperTitle: string;
  paperLink: string;
  citationText: string;
  lineNumber?: string;
  context: string;
}

interface AnalysisResult {
  keywords: string[];
  relatedPapers: RelatedPaper[];
  citations: Citation[];
  crossReferences: Citation[];
  summary: string;
}

export async function analyzePdfForCrossReference(file: File): Promise<AnalysisResult> {
  console.log('Starting PDF cross-reference analysis for:', file.name);

  // Step 1: Upload PDF to Gemini and extract text  
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  // Convert file to base64 for Gemini upload
  const arrayBuffer = await file.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString('base64');

  // Step 1: Extract keywords and summary from PDF
  console.log('Extracting keywords and summary from PDF...');
  const keywordPrompt = `
    Analyze this research paper PDF and extract:
    1. A comprehensive list of 15-20 relevant keywords that could be used to find related research papers
    2. A brief summary (2-3 sentences) of the main research topic and findings
    
    Focus on scientific terms, methodologies, research topics, and key concepts.
    Return the response in this exact JSON format:
    {
      "keywords": ["keyword1", "keyword2", ...],
      "summary": "Brief summary of the paper"
    }
  `;

  const keywordResult = await model.generateContent([
    {
      inlineData: {
        data: base64Data,
        mimeType: 'application/pdf'
      }
    },
    keywordPrompt
  ]);

  let extractedData: { keywords: string[]; summary: string };
  try {
    const responseText = keywordResult.response.text();
    // Clean the response to extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }
    extractedData = JSON.parse(jsonMatch[0]) as { keywords: string[]; summary: string };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('Failed to extract keywords from PDF');
  }

  const { keywords, summary } = extractedData;
  console.log('Extracted keywords:', keywords);

  // Step 2: Search for related papers using keywords
  console.log('Searching for related papers...');
  const allPapers = await fetchPapersData();
  const relatedPapersMap = new Map<string, RelatedPaper>();

  // Search for each keyword and collect matching papers
  for (const keyword of keywords) {
    const searchResults = searchPapers(allPapers, keyword);
    
    searchResults.forEach(paper => {
      if (relatedPapersMap.has(paper.id)) {
        // Increase relevance score if paper matches multiple keywords
        const existing = relatedPapersMap.get(paper.id)!;
        existing.relevanceScore += 0.1;
        existing.matchingKeywords.push(keyword);
      } else {
        // Calculate base relevance score
        let titleMatches = 0;
        let contentMatches = 0;
        
        for (const kw of keywords) {
          if (paper.title.toLowerCase().includes(kw.toLowerCase())) {
            titleMatches++;
          }
          if (paper.content.toLowerCase().includes(kw.toLowerCase())) {
            contentMatches++;
          }
        }
        
        const relevanceScore = Math.min(0.95, 
          (titleMatches * 0.3 + contentMatches * 0.1) / keywords.length + 0.1
        );

        relatedPapersMap.set(paper.id, {
          id: paper.id,
          title: paper.title,
          link: paper.link,
          relevanceScore,
          matchingKeywords: [keyword]
        });
      }
    });
  }

  // Get top 10 most relevant papers
  const relatedPapers = Array.from(relatedPapersMap.values())
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10);

  console.log(`Found ${relatedPapers.length} related papers`);

  // Step 3: Analyze each related paper for citations and cross-references
  console.log('Analyzing papers for citations and cross-references...');
  const citations: Citation[] = [];
  const crossReferences: Citation[] = [];

  // Process top 5 papers for citation analysis to avoid rate limits
  const topPapers = relatedPapers.slice(0, 5);

  for (const paper of topPapers) {
    try {
      console.log(`Analyzing paper: ${paper.title}`);
      
      // Use the same URL-based analysis as the summary feature
      const citationPrompt = `
        Analyze this research paper from URL: ${paper.link}
        
        Compare it with the uploaded PDF content and find:
        1. Any citations or references to similar research
        2. Cross-references or related methodologies
        3. Overlapping research topics or findings
        
        Return specific quotes with context. Format as JSON:
        {
          "citations": [
            {
              "citationText": "exact quote from the paper",
              "context": "surrounding context explaining the citation",
              "lineNumber": "approximate line or section number if identifiable"
            }
          ],
          "crossReferences": [
            {
              "citationText": "exact quote showing cross-reference",
              "context": "context explaining how this relates to the uploaded paper"
            }
          ]
        }
      `;

      const citationResult = await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: 'application/pdf'
          }
        },
        citationPrompt
      ]);

      const responseText = citationResult.response.text();
      let citationData;
      
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          citationData = JSON.parse(jsonMatch[0]);
          
          // Add paper information to citations
          citationData.citations?.forEach((citation: any) => {
            citations.push({
              paperTitle: paper.title,
              paperLink: paper.link,
              citationText: citation.citationText,
              lineNumber: citation.lineNumber,
              context: citation.context
            });
          });

          citationData.crossReferences?.forEach((ref: any) => {
            crossReferences.push({
              paperTitle: paper.title,
              paperLink: paper.link,
              citationText: ref.citationText,
              context: ref.context
            });
          });
        }
      } catch (parseError) {
        console.warn(`Failed to parse citation analysis for ${paper.title}:`, parseError);
      }

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.warn(`Error analyzing paper ${paper.title}:`, error);
      // Continue with other papers even if one fails
    }
  }

  console.log(`Analysis complete. Found ${citations.length} citations and ${crossReferences.length} cross-references`);

  return {
    keywords,
    summary,
    relatedPapers,
    citations,
    crossReferences
  };
}
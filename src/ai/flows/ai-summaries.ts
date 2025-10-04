'use server';

/**
 * @fileOverview Generates summaries of research papers using Google GenAI Files API.
 *
 * - generateSummary - A function that generates a summary of a research paper.
 * - SummaryInput - The input type for the generateSummary function.
 * - SummaryOutput - The return type for the generateSummary function.
 */

import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const SummaryInputSchema = z.object({
  paperUrl: z.string().describe('The URL to the research paper web page that Gemini will fetch and analyze directly.'),
  complexityLevel: z.enum(['Expert', 'Student', 'ELI10']).describe('The desired complexity level of the summary.'),
  userProfile: z.object({
    age: z.number().describe('The age of the user.'),
    experienceLevel: z.string().describe('The experience level of the user.'),
    learningStyle: z.enum(['text', 'visual', 'audio']).describe('The learning style of the user.'),
  }).optional().describe('The profile of the user requesting the summary.  If present, the summary will be personalized to them.'),
});
export type SummaryInput = z.infer<typeof SummaryInputSchema>;

const SummaryOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the research paper.'),
});
export type SummaryOutput = z.infer<typeof SummaryOutputSchema>;

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Helper function to fetch web content
async function fetchWebContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Extract text content from HTML (basic extraction)
    // Remove script and style elements
    const cleanHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleanHtml;
  } catch (error) {
    console.error('Error fetching web content:', error);
    throw new Error(`Failed to fetch content from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateSummary(input: SummaryInput): Promise<SummaryOutput> {
  const { paperUrl, complexityLevel, userProfile } = input;
  
  let userProfileText = '';
  if (userProfile) {
    userProfileText = `
    The user requesting this summary has the following profile, take it into account when generating the summary to personalize it to them:
    Age: ${userProfile.age}
    Experience Level: ${userProfile.experienceLevel}
    Learning Style: ${userProfile.learningStyle}
    `;
  }

  const promptText = `You are an expert AI assistant that generates summaries of research papers.

  I have provided you with access to a research paper web page. Please analyze the content of this research paper and create a comprehensive summary at the ${complexityLevel} level by:
  1. Analyzing both the text content and any images, figures, charts, or diagrams in the document
  2. Extracting key findings, methodology, and conclusions
  3. Identifying important visual data representations
  
  ${userProfileText}

  Please provide a comprehensive summary that captures:
  - Main research objectives and hypotheses
  - Methodology and experimental design
  - Key findings from both text and visual elements
  - Statistical results and data interpretations
  - Conclusions and implications
  - Any notable figures, charts, or diagrams that support the findings

  Focus on making the summary appropriate for the ${complexityLevel} level while maintaining scientific accuracy.
  `;

  try {
    console.log(`Analyzing research paper from URL: ${paperUrl}...`);
    
    const tools = [
      { urlContext: {} },
    ];
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      tools,
    };
    const model = 'gemini-2.5-flash';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `${promptText}

Research Paper URL: ${paperUrl}`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let summary = '';
    for await (const chunk of response) {
      if (chunk.text) {
        summary += chunk.text;
      }
    }

    if (!summary || summary.trim() === '') {
      throw new Error('Empty response from AI');
    }

    console.log(`Generated summary of ${summary.length} characters from URL-based PDF analysis`);
    return { summary };

  } catch (error) {
    console.error('Error generating summary from URL:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
    throw new Error('Failed to generate summary: Unknown error');
  }
}

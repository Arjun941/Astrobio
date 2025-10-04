'use server';

/**
 * @fileOverview Generates a mind map JSON structure from a research paper using direct URL analysis with Gemini.
 *
 * - generateMindmap - A function that generates the mind map.
 * - MindmapInput - The input type for the generateMindmap function.
 * - MindmapOutput - The return type for the generateMindmap function.
 */

import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const MindmapInputSchema = z.object({
  paperUrl: z.string().describe('The URL to the research paper web page that Gemini will fetch and analyze directly.'),
});
export type MindmapInput = z.infer<typeof MindmapInputSchema>;

const MindmapOutputSchema = z.object({
  nodes: z.array(z.object({
    id: z.string(),
    type: z.string().optional(),
    data: z.object({ label: z.string() }),
    position: z.object({ x: z.number(), y: z.number() }),
  })),
  edges: z.array(z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    label: z.string().optional(),
  })),
});
export type MindmapOutput = z.infer<typeof MindmapOutputSchema>;

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateMindmap(input: MindmapInput): Promise<MindmapOutput> {
  const { paperUrl } = input;
  
  const promptText = `You are an expert in creating mind maps from research papers.

  I have provided you with access to a research paper web page. Please analyze the content and create a mind map structure representing the key concepts and their relationships by:
  - Identifying the main research topic as the central node
  - Creating nodes for key concepts, methods, findings, and conclusions
  - Establishing logical relationships between concepts
  - Using hierarchical positioning with the main topic at center
  - Including 8-15 nodes for optimal visualization
  
  Return a JSON structure with "nodes" and "edges" arrays suitable for React Flow:
  
  nodes: Array of objects with:
  - id: unique string identifier
  - data: { label: "concept name" }
  - position: { x: number, y: number } (spread nodes evenly, main topic at 400,200)
  
  edges: Array of objects with:
  - id: unique string identifier  
  - source: source node id
  - target: target node id
  - label: relationship description (optional)
  
  Ensure the JSON is valid and well-formatted.
  `;

  try {
    console.log(`Analyzing research paper for mindmap generation from URL: ${paperUrl}...`);
    
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

    let mindmapJson = '';
    for await (const chunk of response) {
      if (chunk.text) {
        mindmapJson += chunk.text;
      }
    }

    if (!mindmapJson || mindmapJson.trim() === '') {
      throw new Error('Empty response from AI');
    }

    // Parse and validate the JSON structure
    let mindmapData;
    try {
      // Extract JSON from response if it's wrapped in markdown
      const jsonMatch = mindmapJson.match(/```json\n?([\s\S]*?)\n?```/) || mindmapJson.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : mindmapJson;
      mindmapData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing mindmap JSON:', parseError);
      throw new Error('Invalid JSON structure returned from AI');
    }

    // Validate the structure
    const validatedData = MindmapOutputSchema.parse(mindmapData);
    
    console.log(`Generated mindmap with ${validatedData.nodes.length} nodes and ${validatedData.edges.length} edges`);
    return validatedData;

  } catch (error) {
    console.error('Error generating mindmap from URL:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate mindmap: ${error.message}`);
    }
    throw new Error('Failed to generate mindmap: Unknown error');
  }
}

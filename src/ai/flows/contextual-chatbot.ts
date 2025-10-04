'use server';

/**
 * @fileOverview A contextual chatbot AI agent for answering questions about a research paper using direct URL analysis with Gemini.
 *
 * - contextualChatbot - A function that handles the chatbot interaction.
 * - ContextualChatbotInput - The input type for the contextualChatbot function.
 * - ContextualChatbotOutput - The return type for the contextualChatbot function.
 */

import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const ContextualChatbotInputSchema = z.object({
  paperUrl: z.string().describe('The URL to the research paper web page that Gemini will fetch and analyze directly.'),
  question: z.string().describe('The user question about the research paper.'),
});
export type ContextualChatbotInput = z.infer<typeof ContextualChatbotInputSchema>;

const ContextualChatbotOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user question, based on the research paper.'),
});
export type ContextualChatbotOutput = z.infer<typeof ContextualChatbotOutputSchema>;

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function contextualChatbot(input: ContextualChatbotInput): Promise<ContextualChatbotOutput> {
  const { paperUrl, question } = input;
  
  const promptText = `You are a helpful chatbot assistant that answers questions about research papers.

  I have provided you with access to a research paper web page. Please analyze the content and based on this research paper, answer the following question:

  Question: ${question}

  Guidelines for your response:
  - Use information directly from the research paper to answer the question
  - Be accurate and cite specific findings, methods, or conclusions when relevant
  - If the answer cannot be found in the research paper, clearly state that the information is not available in this paper
  - Provide a helpful and informative response that addresses the user's question
  - Keep the response concise but thorough
  - Use scientific language appropriate for the context
  `;

  try {
    console.log(`Analyzing research paper for chatbot question from URL: ${paperUrl}...`);
    console.log(`Question: ${question}`);
    
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

    let answer = '';
    for await (const chunk of response) {
      if (chunk.text) {
        answer += chunk.text;
      }
    }

    if (!answer || answer.trim() === '') {
      throw new Error('Empty response from AI');
    }

    console.log(`Generated chatbot answer of ${answer.length} characters`);
    return { answer };

  } catch (error) {
    console.error('Error generating chatbot response from URL:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate chatbot response: ${error.message}`);
    }
    throw new Error('Failed to generate chatbot response: Unknown error');
  }
}

'use server';

/**
 * @fileOverview A quiz generation AI agent using direct URL analysis with Gemini.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const GenerateQuizInputSchema = z.object({
  paperUrl: z.string().describe('The URL to the research paper web page that Gemini will fetch and analyze directly.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answers.'),
      answer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions and answers.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  const { paperUrl } = input;
  
  const promptText = `You are an expert quiz generator specializing in creating quizzes from research papers.

  I have provided you with access to a research paper web page. Please analyze the content and create a quiz with 4-6 multiple-choice questions based on the research paper content by:
  - Focusing on key findings, methodology, and conclusions
  - Creating questions at different difficulty levels
  - Ensuring each question has 4 possible answers with only one correct answer
  - Making questions that test understanding, not just memorization
  - Covering different aspects of the paper (background, methods, results, conclusions)

  Return the quiz as a JSON structure with the following format:
  
  {
    "quiz": [
      {
        "question": "What was the main objective of this research?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "answer": "Option 2"
      }
    ]
  }

  Ensure the JSON is valid and well-formatted. The "answer" field should contain the exact text of the correct option.
  `;

  try {
    console.log(`Analyzing research paper for quiz generation from URL: ${paperUrl}...`);
    
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

    let quizJson = '';
    for await (const chunk of response) {
      if (chunk.text) {
        quizJson += chunk.text;
      }
    }

    if (!quizJson || quizJson.trim() === '') {
      throw new Error('Empty response from AI');
    }

    // Parse and validate the JSON structure
    let quizData;
    try {
      // Extract JSON from response if it's wrapped in markdown
      const jsonMatch = quizJson.match(/```json\n?([\s\S]*?)\n?```/) || quizJson.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : quizJson;
      quizData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing quiz JSON:', parseError);
      throw new Error('Invalid JSON structure returned from AI');
    }

    // Validate the structure
    const validatedData = GenerateQuizOutputSchema.parse(quizData);
    
    console.log(`Generated quiz with ${validatedData.quiz.length} questions`);
    return validatedData;

  } catch (error) {
    console.error('Error generating quiz from URL:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate quiz: ${error.message}`);
    }
    throw new Error('Failed to generate quiz: Unknown error');
  }
}

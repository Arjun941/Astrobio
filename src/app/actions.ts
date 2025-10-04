"use server";

import "server-only";
import { generateSummary, SummaryInput } from "@/ai/flows/ai-summaries";
import { generateMindmap } from "@/ai/flows/mindmap-generation";
import { generateAudioNarration } from "@/ai/flows/audio-narration";
import { contextualChatbot } from "@/ai/flows/contextual-chatbot";
import { generateQuiz } from "@/ai/flows/ai-quiz-generation";
import { UserProfile } from "@/hooks/use-auth";

export async function getSummaryAction(
  paperUrl: string,
  complexityLevel: 'Expert' | 'Student' | 'ELI10',
  userProfile: UserProfile | null
) {
  console.log('getSummaryAction called with paperUrl:', paperUrl);
  
  try {
    // Validate URL
    if (!paperUrl || paperUrl.trim() === '') {
      throw new Error("No research paper URL provided");
    }

    // Check if URL is valid
    try {
      new URL(paperUrl);
    } catch {
      throw new Error("Invalid research paper URL format");
    }
    
    const input: SummaryInput = { paperUrl, complexityLevel };
    if (userProfile) {
      input.userProfile = {
        age: userProfile.age,
        experienceLevel: userProfile.experienceLevel,
        learningStyle: userProfile.learningStyle.toLowerCase() as 'text' | 'visual' | 'audio',
      };
    }
    
    const result = await generateSummary(input);
    return { summary: result.summary };
  } catch (error) {
    console.error("Error in getSummaryAction:", error);
    return { error: (error as Error).message };
  }
}

export async function getMindmapAction(paperUrl: string) {
  console.log('getMindmapAction called with paperUrl:', paperUrl);
  
  try {
    // Validate URL
    if (!paperUrl || paperUrl.trim() === '') {
      throw new Error("No research paper URL provided");
    }

    // Check if URL is valid
    try {
      new URL(paperUrl);
    } catch {
      throw new Error("Invalid research paper URL format");
    }
    
    const result = await generateMindmap({ paperUrl });
    return { mindmap: result };
  } catch (error) {
    console.error("Error in getMindmapAction:", error);
    return { error: (error as Error).message };
  }
}

export async function getAudioNarrationAction(
  paperUrl: string, 
  voice?: string
) {
  console.log('getAudioNarrationAction called with paperUrl:', paperUrl, 'voice:', voice);
  
  try {
    // Validate URL
    if (!paperUrl || paperUrl.trim() === '') {
      throw new Error("No research paper URL provided");
    }

    // Check if URL is valid
    try {
      new URL(paperUrl);
    } catch {
      throw new Error("Invalid research paper URL format");
    }
    
    const input: any = { paperUrl };
    if (voice) {
      input.voice = voice;
    }
    
    const result = await generateAudioNarration(input);
    return { 
      narrationScript: result.narrationScript,
      audioDataUri: result.audioDataUri 
    };
  } catch (error) {
    console.error("Error in getAudioNarrationAction:", error);
    return { error: (error as Error).message };
  }
}

export async function getChatbotResponseAction(paperUrl: string, question: string) {
  console.log('getChatbotResponseAction called with paperUrl:', paperUrl, 'question:', question);
  
  try {
    // Validate URL
    if (!paperUrl || paperUrl.trim() === '') {
      throw new Error("No research paper URL provided");
    }

    // Validate question
    if (!question || question.trim() === '') {
      throw new Error("No question provided");
    }

    // Check if URL is valid
    try {
      new URL(paperUrl);
    } catch {
      throw new Error("Invalid research paper URL format");
    }
    
    const result = await contextualChatbot({ paperUrl, question });
    return { answer: result.answer };
  } catch (error) {
    console.error("Error in getChatbotResponseAction:", error);
    return { error: (error as Error).message };
  }
}

export async function getQuizAction(paperUrl: string) {
  console.log('getQuizAction called with paperUrl:', paperUrl);
  
  try {
    // Validate URL
    if (!paperUrl || paperUrl.trim() === '') {
      throw new Error("No research paper URL provided");
    }

    // Check if URL is valid
    try {
      new URL(paperUrl);
    } catch {
      throw new Error("Invalid research paper URL format");
    }
    
    const result = await generateQuiz({ paperUrl });
    return { quiz: result.quiz };
  } catch (error) {
    console.error("Error in getQuizAction:", error);
    return { error: (error as Error).message };
  }
}

export async function analyzePdfAction(file: File) {
  console.log('analyzePdfAction called with file:', file.name);
  
  try {
    if (!file || file.type !== 'application/pdf') {
      throw new Error("Invalid file type. Please upload a PDF file.");
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      throw new Error("File too large. Please upload a file smaller than 50MB.");
    }

    // Import the analysis function
    const { analyzePdfForCrossReference } = await import("@/ai/flows/pdf-cross-reference");
    
    const result = await analyzePdfForCrossReference(file);
    return { analysis: result };
  } catch (error) {
    console.error("Error in analyzePdfAction:", error);
    return { error: (error as Error).message };
  }
}

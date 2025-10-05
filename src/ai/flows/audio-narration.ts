'use server';

/**
 * @fileOveexport async function generateAudioNarration(input: AudioNarrationInput): Promise<AudioNarrationOutput> {
  const { paperUrl, voice = 'Puck' } = input;

  try {
    console.log(`🎤 Generating audio narration from URL: ${paperUrl} with voice: ${voice}...`);

    // Step 1: Generate the narration script using Gemini URL context tool
    const promptText = `You are an expert science communicator creating an engaging audio narration for a research paper.

I have provided you with access to a research paper web page. Please analyze the full content of this research paper and create a compelling audio narration script that:

1. **Introduction** (30-45 seconds):
   - Hook the listener with the significance of the research
   - Introduce the main research question or problem
   - Explain why this matters in the broader context

2. **Methodology** (45-60 seconds):
   - Explain the experimental approach in accessible terms
   - Highlight key methods or innovative techniques used
   - Mention important details about subjects, procedures, or data collection

3. **Key Findings** (60-90 seconds):
   - Present the main results clearly and engagingly
   - Reference important figures, charts, or data when relevant
   - Explain what the numbers and findings actually mean

4. **Conclusions & Impact** (30-45 seconds):
   - Summarize the key takeaways
   - Explain broader implications for the field
   - Mention potential future research directions or applications

**Requirements:**
- Write in a conversational, engaging tone suitable for audio
- Use natural speech patterns with smooth transitions
- Make complex concepts accessible without oversimplifying
- Total length should be 3-4 minutes when spoken (approximately 450-600 words)
- Include natural pauses and emphasis cues where appropriate
- Reference specific findings from the paper's content and figures

Please provide ONLY the narration script text, ready to be converted to speech.`;

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

    let narrationScript = '';
    for await (const chunk of response) {
      if (chunk.text) {
        narrationScript += chunk.text;
      }
    }

    if (!narrationScript || narrationScript.trim() === '') {
      throw new Error('Empty narration script generated');
    }o narration using Gemini URL context and TTS API
 */

import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const AudioNarrationInputSchema = z.object({
  paperUrl: z.string().describe('The URL to the research paper web page.'),
  voice: z.enum([
    'Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir', 'Leda', 
    'Orus', 'Aoede', 'Callirhoe', 'Autonoe', 'Enceladus', 
    'Iapetus', 'Umbriel', 'Algieba', 'Despina', 'Erinome',
    'Algenib', 'Rasalgethi', 'Laomedeia', 'Achernar', 'Alnilam',
    'Schedar', 'Gacrux', 'Pulcherrima', 'Achird', 'Zubenelgenubi',
    'Vindemiatrix', 'Sadachbia', 'Sadaltager', 'Sulafar'
  ]).optional().default('Puck'),
});
export type AudioNarrationInput = z.infer<typeof AudioNarrationInputSchema>;

const AudioNarrationOutputSchema = z.object({
  narrationScript: z.string().describe('The audio narration script.'),
  audioDataUri: z.string().describe('The audio data in WAV format as a data URI.'),
});
export type AudioNarrationOutput = z.infer<typeof AudioNarrationOutputSchema>;

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateAudioNarration(input: AudioNarrationInput): Promise<AudioNarrationOutput> {
  const { paperUrl, voice = 'Puck' } = input;

  try {
    console.log(`🎤 Generating audio narration from URL: ${paperUrl} with voice: ${voice}...`);

    // Step 1: Generate the narration script using Gemini URL context tool
    const promptText = `You are an expert science communicator creating an engaging audio narration for a research paper.

I have provided you with access to a research paper web page. Please analyze the full content of this research paper and create a compelling audio narration script that:

1. **Introduction** (30-45 seconds):
   - Hook the listener with the significance of the research
   - Introduce the main research question or problem
   - Explain why this matters in the broader context

2. **Methodology** (45-60 seconds):
   - Explain the experimental approach in accessible terms
   - Highlight key methods or innovative techniques used
   - Mention important details about subjects, procedures, or data collection

3. **Key Findings** (60-90 seconds):
   - Present the main results clearly and engagingly
   - Reference important figures, charts, or data when relevant
   - Explain what the numbers and findings actually mean

4. **Conclusions & Impact** (30-45 seconds):
   - Summarize the key takeaways
   - Explain broader implications for the field
   - Mention potential future research directions or applications

**Requirements:**
- Write in a conversational, engaging tone suitable for audio
- Use natural speech patterns with smooth transitions
- Make complex concepts accessible without oversimplifying
- Total length should be 3-4 minutes when spoken (approximately 450-600 words)
- Include natural pauses and emphasis cues where appropriate
- Reference specific findings from the paper's content and figures

Please provide ONLY the narration script text, ready to be converted to speech.`;

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

    console.log('📝 Generating narration script using URL context...');
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let narrationScript = '';
    for await (const chunk of response) {
      if (chunk.text) {
        narrationScript += chunk.text;
      }
    }

    if (!narrationScript || narrationScript.trim() === '') {
      throw new Error('Empty narration script generated');
    }

    console.log(`📜 Generated script: ${narrationScript.length} characters`);

    // Step 2: Convert script to audio using internal TTS API
    console.log('🎙️ Converting script to audio using Gemini TTS...');
    
    const ttsPrompt = `Read the following research paper narration in a clear, professional voice:

${narrationScript}`;

    // Call our internal TTS API
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXTAUTH_URL 
      ? process.env.NEXTAUTH_URL
      : 'http://localhost:9002';
    
    const ttsResponse = await fetch(`${baseUrl}/api/audio-narration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: ttsPrompt,
        voice: voice
      }),
    });

    if (!ttsResponse.ok) {
      const errorData = await ttsResponse.json();
      throw new Error(`TTS API error: ${errorData.error}`);
    }

    const { audioDataUri } = await ttsResponse.json();
    
    if (!audioDataUri) {
      throw new Error('No audio data received from TTS API');
    }
    
    console.log('✅ Audio narration generated successfully!');
    console.log(`   - Script length: ${narrationScript.length} characters`);
    console.log(`   - Voice used: ${voice}`);
    console.log(`   - Audio data URI generated`);
    
    return { 
      narrationScript: narrationScript.trim(), 
      audioDataUri 
    };

  } catch (error) {
    console.error('❌ Error generating audio narration:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate audio narration: ${error.message}`);
    }
    throw new Error('Failed to generate audio narration: Unknown error');
  }
}

// Simple function for direct text-to-speech conversion
export async function generateAudioWithFallback(text: string, voice: string = 'Puck'): Promise<string> {
  console.log('🎯 Using native Gemini TTS for direct audio generation...');
  
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXTAUTH_URL 
      ? process.env.NEXTAUTH_URL
      : 'http://localhost:9002';
    
    const ttsResponse = await fetch(`${baseUrl}/api/audio-narration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice: voice
      }),
    });

    if (!ttsResponse.ok) {
      const errorData = await ttsResponse.json();
      throw new Error(`TTS API error: ${errorData.error}`);
    }

    const { audioDataUri } = await ttsResponse.json();
    
    if (!audioDataUri) {
      throw new Error('No audio data received from TTS API');
    }

    return audioDataUri;

  } catch (error) {
    console.error('❌ Native Gemini TTS generation failed:', error);
    throw new Error(`TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

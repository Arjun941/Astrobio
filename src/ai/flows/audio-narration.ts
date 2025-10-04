'use server';

/**
 * @fileOverview Generates audio narration using native Gemini TTS API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
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

// Initialize GoogleGenerativeAI for text generation 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAudioNarration(input: AudioNarrationInput): Promise<AudioNarrationOutput> {
  const { paperUrl, voice = 'Puck' } = input;

  try {
    console.log(`🎤 Generating audio narration from URL: ${paperUrl} with voice: ${voice}...`);

    // Step 1: Generate the narration script using regular Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const scriptPrompt = `Analyze the research paper from this URL and create a comprehensive narration that covers:
    - Introduction to the topic and its significance
    - Key methodology and approach
    - Main findings and results
    - Conclusions and implications

    Make it clear, engaging, scientifically accurate, and about 2-3 minutes when spoken.
    
    URL: ${paperUrl}`;

    console.log('📝 Generating narration script...');
    const scriptResult = await model.generateContent(scriptPrompt);
    const narrationScript = scriptResult.response.text();

    if (!narrationScript || narrationScript.trim() === '') {
      throw new Error('Failed to generate narration script');
    }

    console.log(`📜 Generated script: ${narrationScript.length} characters`);

    // Step 2: Convert script to audio using internal TTS API
    console.log('🎙️ Converting script to audio using Gemini TTS...');
    
    const ttsPrompt = `Read the following research paper narration in a clear, professional voice:

${narrationScript}`;

    // Call our internal TTS API
    const ttsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:9002'}/api/audio-narration`, {
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
    console.error('❌ Error generating Gemini audio narration:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate audio narration with Gemini TTS: ${error.message}`);
    }
    throw new Error('Failed to generate audio narration: Unknown error');
  }
}

// Simple function for direct text-to-speech conversion
export async function generateAudioWithFallback(text: string, voice: string = 'Puck'): Promise<string> {
  console.log('🎯 Using native Gemini TTS for direct audio generation...');
  
  try {
    const ttsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:9002'}/api/audio-narration`, {
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

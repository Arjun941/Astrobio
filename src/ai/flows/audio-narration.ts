'use server';

/**
 * @fileoverview Generate audio narration using Gemini URL context and TTS API
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
    const promptText = `You are an expert science communicator creating a direct, dialogue-based audio narration for a research paper.

I have provided you with access to a research paper web page. Please analyze the full content of this research paper and create a compelling audio narration script that speaks directly to the listener:

1. **Introduction** (30-45 seconds):
   - Start with what the research discovered or why it matters
   - Directly state the main research question or problem
   - Tell the listener why they should care about this research

2. **Methodology** (45-60 seconds):
   - Directly explain how the researchers conducted their study
   - Tell the listener what the scientists did and how they did it
   - Mention the key experimental details in plain language

3. **Key Findings** (60-90 seconds):
   - Directly present what the researchers found
   - Tell the listener the specific results and what they mean
   - Explain the significance of the numbers and data

4. **Conclusions & Impact** (30-45 seconds):
   - Directly state what this research means for the field
   - Tell the listener how this might impact future research or applications
   - Conclude with the main takeaway

**CRITICAL REQUIREMENTS:**
- Write ONLY in direct dialogue - speak directly to the listener
- NO descriptive text, stage directions, or meta-commentary
- NO phrases like "The narrator explains" or "We hear about"
- Use "I", "you", "we" - speak conversationally and directly
- Write as if you're having a conversation with the listener
- Total length should be 3-4 minutes when spoken (approximately 450-600 words)
- Every sentence should be speakable dialogue only

Please provide ONLY the direct dialogue script - no descriptions, no stage directions, just the words to be spoken.`;

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

    // Step 2: Convert script to audio using Gemini TTS directly
    console.log('🎙️ Converting script to audio using Gemini TTS...');
    
    // Create system prompt for TTS to ensure dialogue-only output
    const ttsPrompt = `Please read the following research paper narration in a clear, conversational voice. This is direct dialogue meant to be spoken naturally, without any descriptive text or stage directions:

${narrationScript}`;

    // Generate audio directly using Gemini TTS with system configuration
    const ttsGenAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    const ttsResponse = await ttsGenAI.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: ttsPrompt }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });
    
    const audioData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioData) {
      throw new Error('No audio data returned from Gemini TTS');
    }

    // Convert PCM to WAV and create data URI
    const pcmBuffer = Buffer.from(audioData, 'base64');
    
    // Create WAV header for 24kHz mono 16-bit audio
    const wavHeader = Buffer.alloc(44);
    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
    wavHeader.write('WAVE', 8);
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16);
    wavHeader.writeUInt16LE(1, 20); // PCM
    wavHeader.writeUInt16LE(1, 22); // Mono
    wavHeader.writeUInt32LE(24000, 24); // Sample rate
    wavHeader.writeUInt32LE(48000, 28); // Byte rate
    wavHeader.writeUInt16LE(2, 32); // Block align
    wavHeader.writeUInt16LE(16, 34); // Bits per sample
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(pcmBuffer.length, 40);
    
    const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
    const audioDataUri = `data:audio/wav;base64,${wavBuffer.toString('base64')}`;
    
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
    
    // More specific error handling
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Return a more user-friendly error based on the type
      if (error.message.includes('API key')) {
        return { 
          narrationScript: 'API configuration error', 
          audioDataUri: '' 
        };
      }
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return { 
          narrationScript: 'Service temporarily unavailable due to rate limits', 
          audioDataUri: '' 
        };
      }
      
      if (error.message.includes('No audio data')) {
        return { 
          narrationScript: 'Audio generation failed - TTS service error', 
          audioDataUri: '' 
        };
      }
      
      // Generic fallback
      return { 
        narrationScript: `Generation failed: ${error.message}`, 
        audioDataUri: '' 
      };
    }
    
    return { 
      narrationScript: 'Unknown error occurred during audio generation', 
      audioDataUri: '' 
    };
  }
}

// Simple function for direct text-to-speech conversion
export async function generateAudioWithFallback(text: string, voice: string = 'Puck'): Promise<string> {
  console.log('🎯 Using native Gemini TTS for direct audio generation...');
  
  try {
    // Generate audio directly using Gemini TTS
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });
    
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioData) {
      throw new Error('No audio data returned from Gemini TTS');
    }

    // Convert PCM to WAV and create data URI
    const pcmBuffer = Buffer.from(audioData, 'base64');
    
    // Create WAV header for 24kHz mono 16-bit audio
    const wavHeader = Buffer.alloc(44);
    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
    wavHeader.write('WAVE', 8);
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16);
    wavHeader.writeUInt16LE(1, 20); // PCM
    wavHeader.writeUInt16LE(1, 22); // Mono
    wavHeader.writeUInt32LE(24000, 24); // Sample rate
    wavHeader.writeUInt32LE(48000, 28); // Byte rate
    wavHeader.writeUInt16LE(2, 32); // Block align
    wavHeader.writeUInt16LE(16, 34); // Bits per sample
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(pcmBuffer.length, 40);
    
    const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
    const audioDataUri = `data:audio/wav;base64,${wavBuffer.toString('base64')}`;
    
    return audioDataUri;

  } catch (error) {
    console.error('❌ Native Gemini TTS generation failed:', error);
    
    if (error instanceof Error) {
      console.error('TTS Error details:', {
        name: error.name,
        message: error.message,
      });
    }
    
    throw new Error(`TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

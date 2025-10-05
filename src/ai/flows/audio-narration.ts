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

    // Step 2: Convert script to audio using Gemini TTS directly
    console.log('🎙️ Converting script to audio using Gemini TTS...');
    
    const ttsPrompt = `Read the following research paper narration in a clear, professional voice:

${narrationScript}`;

    // Generate audio directly using Gemini TTS
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
    throw new Error(`TTS generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

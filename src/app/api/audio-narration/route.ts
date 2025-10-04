import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import wav from 'wav';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { text, voice } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const voiceName = voice || 'Puck';
    console.log(`🎤 TTS Request - Voice: ${voiceName}, Text length: ${text.length}`);
    
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });
    
    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!data) {
      console.error('❌ No audio data in response');
      return NextResponse.json({ error: 'No audio data returned' }, { status: 500 });
    }

    // Convert PCM to WAV format
    const pcmBuffer = Buffer.from(data, 'base64');
    const wavChunks: Buffer[] = [];
    
    const wavWriter = new wav.Writer({
      channels: 1,
      sampleRate: 24000,
      bitDepth: 16,
    });
    
    wavWriter.on('data', (chunk: Buffer) => wavChunks.push(chunk));
    
    const readable = Readable.from(pcmBuffer);
    readable.pipe(wavWriter);
    
    await new Promise(resolve => wavWriter.on('finish', resolve));
    
    const wavBuffer = Buffer.concat(wavChunks);
    const base64WAV = wavBuffer.toString('base64');
    const audioDataUri = `data:audio/wav;base64,${base64WAV}`;
    
    console.log('✅ TTS generation successful');
    
    return NextResponse.json({ audioDataUri }, { status: 200 });
    
  } catch (err) {
    console.error('❌ TTS API Error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
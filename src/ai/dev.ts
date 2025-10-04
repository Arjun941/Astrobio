import { config } from 'dotenv';
config();

import '@/ai/flows/ai-summaries.ts';
import '@/ai/flows/audio-narration.ts';
import '@/ai/flows/ai-quiz-generation.ts';
import '@/ai/flows/mindmap-generation.ts';
import '@/ai/flows/contextual-chatbot.ts';
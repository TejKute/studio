import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-improvements-to-description.ts';
import '@/ai/flows/generate-app-from-description.ts';
import '@/ai/flows/generate-theme-from-description.ts';
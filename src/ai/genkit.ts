import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      // You can specify the model in the generate call or set a default here.
      // Let's stick with the flows defining the model for now.
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
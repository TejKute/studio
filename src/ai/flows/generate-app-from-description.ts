'use server';

/**
 * @fileOverview Generates Flutter app code from a text description.
 *
 * - generateAppFromDescription - A function that generates Flutter app code from a text description.
 * - GenerateAppFromDescriptionInput - The input type for the generateAppFromDescription function.
 * - GenerateAppFromDescriptionOutput - The return type for the generateAppFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppFromDescriptionInputSchema = z.object({
  description: z.string().describe('A detailed description of the desired Flutter app.'),
});
export type GenerateAppFromDescriptionInput = z.infer<typeof GenerateAppFromDescriptionInputSchema>;

const GenerateAppFromDescriptionOutputSchema = z.object({
  flutterCode: z.string().describe('The generated Flutter code for the app.'),
});
export type GenerateAppFromDescriptionOutput = z.infer<typeof GenerateAppFromDescriptionOutputSchema>;

export async function generateAppFromDescription(input: GenerateAppFromDescriptionInput): Promise<GenerateAppFromDescriptionOutput> {
  return generateAppFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppFromDescriptionPrompt',
  input: {schema: GenerateAppFromDescriptionInputSchema},
  output: {schema: GenerateAppFromDescriptionOutputSchema},
  prompt: `You are an expert Flutter developer who can generate Flutter code based on a user's description.

  Description: {{{description}}}

  Generate the Flutter code:
  `,
});

const generateAppFromDescriptionFlow = ai.defineFlow(
  {
    name: 'generateAppFromDescriptionFlow',
    inputSchema: GenerateAppFromDescriptionInputSchema,
    outputSchema: GenerateAppFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

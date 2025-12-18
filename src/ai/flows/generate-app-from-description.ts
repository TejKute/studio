'use server';

/**
 * @fileOverview Generates Flutter widget code from a text description.
 *
 * - generateAppFromDescription - A function that generates Flutter widget code from a text description.
 * - GenerateAppFromDescriptionInput - The input type for the generateAppFromDescription function.
 * - GenerateAppFromDescriptionOutput - The return type for the generateAppFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppFromDescriptionInputSchema = z.object({
  description: z.string().describe('A detailed description of the desired Flutter widget.'),
});
export type GenerateAppFromDescriptionInput = z.infer<typeof GenerateAppFromDescriptionInputSchema>;

const GenerateAppFromDescriptionOutputSchema = z.object({
  componentCode: z.string().describe('The generated Flutter widget code for the app.'),
  explanation: z.string().describe('An explanation of the generated code and what was changed.'),
});
export type GenerateAppFromDescriptionOutput = z.infer<typeof GenerateAppFromDescriptionOutputSchema>;

export async function generateAppFromDescription(input: GenerateAppFromDescriptionInput): Promise<GenerateAppFromDescriptionOutput> {
  return generateAppFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppFromDescriptionPrompt',
  input: {schema: GenerateAppFromDescriptionInputSchema},
  output: {schema: GenerateAppFromDescriptionOutputSchema},
  prompt: `You are an expert Flutter developer. Your task is to generate a single, self-contained Flutter widget based on the user's description.
  The widget should use Material Design components (e.g., Scaffold, Card, ElevatedButton).
  Do not include the 'main()' function or 'runApp()'.
  The code should be a single Widget, ready to be dropped into a Flutter application.
  Provide a brief explanation of the widget you've created.

  Description: {{{description}}}

  Generate the Flutter widget code and an explanation.
  `,
  model: 'gemini-1.5-flash',
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

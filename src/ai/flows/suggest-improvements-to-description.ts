'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting improvements to a user's text prompt for generating an app.
 *
 * It exports:
 * - `suggestImprovementsToDescription`: An async function that takes a text description and returns improvement suggestions.
 * - `SuggestImprovementsToDescriptionInput`: The input type for the `suggestImprovementsToDescription` function.
 * - `SuggestImprovementsToDescriptionOutput`: The output type for the `suggestImprovementsToDescription` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SuggestImprovementsToDescriptionInputSchema = z.object({
  description: z.string().describe('The text description of the desired app.'),
});
export type SuggestImprovementsToDescriptionInput = z.infer<typeof SuggestImprovementsToDescriptionInputSchema>;

// Define the output schema
const SuggestImprovementsToDescriptionOutputSchema = z.object({
  suggestions: z.string().describe('AI-generated suggestions for improving the app description.'),
});
export type SuggestImprovementsToDescriptionOutput = z.infer<typeof SuggestImprovementsToDescriptionOutputSchema>;

// Define the prompt
const suggestImprovementsToDescriptionPrompt = ai.definePrompt({
  name: 'suggestImprovementsToDescriptionPrompt',
  input: {schema: SuggestImprovementsToDescriptionInputSchema},
  output: {schema: SuggestImprovementsToDescriptionOutputSchema},
  prompt: `You are an AI assistant that helps users refine their app descriptions to generate better Flutter code. Given the user's description, provide specific and actionable suggestions on how to improve it. Focus on clarity, detail, and completeness. Suggest adding details about the app's purpose, target audience, key features, and any specific UI elements or functionalities.

User's Description: {{{description}}}

Improvements:
`,
});

// Define the flow
const suggestImprovementsToDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestImprovementsToDescriptionFlow',
    inputSchema: SuggestImprovementsToDescriptionInputSchema,
    outputSchema: SuggestImprovementsToDescriptionOutputSchema,
  },
  async input => {
    const {output} = await suggestImprovementsToDescriptionPrompt(input);
    return output!;
  }
);

/**
 * Suggests improvements to a given app description using AI.
 * @param input The input containing the app description.
 * @returns The output containing AI-generated suggestions for improving the description.
 */
export async function suggestImprovementsToDescription(
  input: SuggestImprovementsToDescriptionInput
): Promise<SuggestImprovementsToDescriptionOutput> {
  return suggestImprovementsToDescriptionFlow(input);
}

'use server';

/**
 * @fileOverview Generates React component code from a text description.
 *
 * - generateAppFromDescription - A function that generates React component code from a text description.
 * - GenerateAppFromDescriptionInput - The input type for the generateAppFromDescription function.
 * - GenerateAppFromDescriptionOutput - The return type for the generateAppFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppFromDescriptionInputSchema = z.object({
  description: z.string().describe('A detailed description of the desired app component.'),
});
export type GenerateAppFromDescriptionInput = z.infer<typeof GenerateAppFromDescriptionInputSchema>;

const GenerateAppFromDescriptionOutputSchema = z.object({
  componentCode: z.string().describe('The generated React component code for the app.'),
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
  prompt: `You are an expert Next.js and React developer. Your task is to generate a single React component based on the user's description.
  The component should be self-contained and use Tailwind CSS for styling.
  You must use shadcn/ui components (e.g., Button, Card, Input) where appropriate.
  The available shadcn/ui components are in the /src/components/ui directory.
  Do not include any imports for React or other libraries, as they are already available in the scope where the component will be rendered.
  Do not wrap the code in a function or export it. Just return the JSX for the component.
  Provide a brief explanation of the component you've created.

  Description: {{{description}}}

  Generate the React component code and an explanation.
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

'use server';

/**
 * @fileOverview Generates a Flutter theme based on a textual description.
 *
 * - generateThemeFromDescription - A function that generates a Flutter theme from a description.
 * - GenerateThemeFromDescriptionInput - The input type for the generateThemeFromDescription function.
 * - GenerateThemeFromDescriptionOutput - The return type for the generateThemeFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThemeFromDescriptionInputSchema = z.object({
  description: z
    .string()
    .describe('A description of the desired look and feel of the app theme.'),
});
export type GenerateThemeFromDescriptionInput = z.infer<
  typeof GenerateThemeFromDescriptionInputSchema
>;

const GenerateThemeFromDescriptionOutputSchema = z.object({
  themeCode: z
    .string()
    .describe(
      'The generated Flutter theme code based on the description, must include all the colors specified in the user interface style.'
    ),
});

export type GenerateThemeFromDescriptionOutput = z.infer<
  typeof GenerateThemeFromDescriptionOutputSchema
>;

export async function generateThemeFromDescription(
  input: GenerateThemeFromDescriptionInput
): Promise<GenerateThemeFromDescriptionOutput> {
  return generateThemeFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThemeFromDescriptionPrompt',
  input: {schema: GenerateThemeFromDescriptionInputSchema},
  output: {schema: GenerateThemeFromDescriptionOutputSchema},
  prompt: `You are an expert Flutter theme developer. You will generate Flutter theme code based on the description provided.

Description: {{{description}}}

The Flutter theme code should include all the colors specified in the user interface style: Primary color: Deep blue (#3F51B5), Background color: Light gray (#F5F5F5), Accent color: Purple (#7E57C2), Code font: 'Source Code Pro'.

The code should be well-formatted and easy to integrate into a Flutter project. Ensure that the generated code is syntactically correct and follows Flutter best practices. Respond only the code, without any decoration. Do not use comments in code. Do not explain the code.

Here is an example of a response:

```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

ThemeData createTheme(BuildContext context) {
  return ThemeData(
    primaryColor: const Color(0xFF3F51B5),
    scaffoldBackgroundColor: const Color(0xFFF5F5F5),
    colorScheme: ColorScheme.fromSwatch().copyWith(
      secondary: const Color(0xFF7E57C2),
    ),
    textTheme: TextTheme(
      headline1: GoogleFonts.spaceGrotesk(
        fontSize: 93,
        fontWeight: FontWeight.w300,
        letterSpacing: -1.5,
        color: Colors.black,
      ),
      bodyText1: GoogleFonts.inter(fontSize: 16.0),
    ),
    fontFamily: GoogleFonts.sourceCodePro().fontFamily,
  );
}
```
`,
});

const generateThemeFromDescriptionFlow = ai.defineFlow(
  {
    name: 'generateThemeFromDescriptionFlow',
    inputSchema: GenerateThemeFromDescriptionInputSchema,
    outputSchema: GenerateThemeFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

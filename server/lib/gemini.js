import { GoogleGenerativeAI } from '@google/generative-ai';

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * @param {string} prompt - The prompt to generate content from
 * @returns {Promise<string>}
 */
export async function generateContent(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (err) {
    console.error(err);
    throw new Error('GENERATION_FAILED');
  }
}

/**
 * @param {string} lang
 * @param {string} transcript
 * @returns {string}
 */
export const getSummarizePrompt = (lang, transcript) => `\
Write a summary in markdown format in "${lang}" using only the information provided in this video transcript:
"${transcript.replace(/"/g, "'")}"`;

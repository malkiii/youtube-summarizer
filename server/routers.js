import { getVideoTranscript } from './lib/captions.js';
import { generateContent, getSummerizeInstruction } from './lib/gemini.js';
import { z } from 'zod';

/**
 * @typedef {import('express').RequestHandler} Router
 */

/** @type {Router} */
export async function summerizeYoutubeVideo(req, res) {
  try {
    const params = z.object({ videoId: z.string(), lang: z.string() }).safeParse(req.query);
    if (!params.success) res.status(400).send('Invalid query parameters!');

    const transcript = await getVideoTranscript(params.data.videoId, params.data.lang);
    const summary = await generateContent(getSummerizeInstruction(params.data.lang, transcript));

    res.status(200).send(summary);
  } catch (error) {
    res.status(500).send('SERVER_ERROR');
  }
}

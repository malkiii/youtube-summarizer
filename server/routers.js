import { getVideoTranscript } from './lib/captions.js';
import { generateContent, getSummerizeInstruction } from './lib/gemini.js';
import Cache from 'node-cache';
import { z } from 'zod';

/**
 * @typedef {import('express').RequestHandler} Router
 */

/** @type {Router} */
export async function locales(req, res) {
  const pathname = req.path === '/' ? '' : req.path;
  const lang = req.cookies.locale ?? 'en';

  return res.redirect(`/${lang}${pathname}`);
}

// Initialize the cache
const cache = new Cache({ stdTTL: 10 * 60 });

/** @type {Router} */
export async function summerizeYoutubeVideo(req, res) {
  try {
    const params = z
      .object({ videoId: z.string(), lang: z.enum(Object.keys(languages)) })
      .safeParse(req.query);

    if (!params.success) throw new Error('INVALID_DATA');

    // Check if data is cached
    const cachedData = cache.get(params.data.videoId);
    if (cachedData) return res.status(200).end(cachedData);

    const transcript = await getVideoTranscript(params.data.videoId, params.data.lang);
    const summary = await generateContent(
      getSummerizeInstruction(languages[params.data.lang], transcript),
    );

    // Cache the data for 10 minutes
    cache.set(params.data.videoId, summary, 10 * 60);

    return res.status(200).end(summary);
  } catch (error) {
    if (error.message) return res.status(400).end(error.message);

    console.error(error);
    res.status(500).end('SERVER_ERROR');
  }
}

export const languages = {
  ar: 'Arabic',
  de: 'German',
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  hi: 'Hindi',
  ja: 'Japanese',
  ko: 'Korean',
  ru: 'Russian',
  zh: 'Chinese',
};

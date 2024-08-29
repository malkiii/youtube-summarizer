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
const cache = new Cache({ stdTTL: 12 * 60 });

/** @type {Router} */
export async function summerizeYoutubeVideo(req, res) {
  try {
    const params = z
      .object({ videoId: z.string(), lang: z.enum(Object.keys(languages)) })
      .safeParse(req.query);

    if (!params.success) throw new Error('INVALID_DATA');

    const { videoId, lang } = params.data;

    // Check if data is cached
    const cachedData = getCachedData(videoId, lang);
    if (cachedData) return res.status(cachedData.status).end(cachedData.data);

    const transcript = await getVideoTranscript(videoId, lang);
    const summary = await generateContent(getSummerizeInstruction(languages[lang], transcript));

    // Cache the data for 12 minutes
    cache.set(`${lang}/${videoId}`, summary, 12 * 60);

    return res.status(200).end(summary);
  } catch (error) {
    if (
      error.message &&
      error.message !== 'INVALID_DATA' &&
      error.message !== 'GENERATION_FAILED'
    ) {
      const videoId = req.query.videoId;
      if (videoId) cache.set(`error/${videoId}`, error.message, 5 * 60);

      return res.status(400).end(error.message);
    }

    if (!error.message) console.error(error);
    res.status(500).end(error.message ?? 'SERVER_ERROR');
  }
}

function getCachedData(key, lang) {
  const data = cache.get(`${lang}/${key}`);
  if (data) return { data, status: 200 };

  const message = cache.get(`error/${key}`);
  if (message) return { data: message, status: 400 };
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

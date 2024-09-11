import axios from 'axios';
import z from 'zod';

/**
 * @param {string} videoId - The YouTube video ID
 * @returns {Promise<string>}
 */
export async function getVideoTranscript(videoId) {
  try {
    const response = await axios.get('https://youtube-v2.p.rapidapi.com/video/subtitles', {
      params: { video_id: videoId },
      headers: {
        'x-rapidapi-host': 'youtube-v2.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      },
    });

    const subtitles = z
      .array(
        z.object({
          id: z.number(),
          start: z.number(),
          duration: z.number(),
          text: z.string(),
        }),
      )
      .parse(response.data.subtitles);

    if (subtitles.length === 0) throw new Error('NO_CAPTIONS');

    const transcript = subtitles.map(subtitle => subtitle.text).join(' ');

    return cleanTranscript(transcript);
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      throw new Error('BAD_REQUEST');
    }

    throw err;
  }
}

function cleanTranscript(transcript) {
  return transcript.trim().replace(/\[[^\]]*\]/g, '');
}

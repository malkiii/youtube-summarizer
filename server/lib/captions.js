import axios from 'axios';
import z from 'zod';

/**
 * @param {string} videoId - The YouTube video ID
 * @returns {Promise<string>}
 */
export async function getVideoTranscript(videoId) {
  try {
    const data = await getSubtitlesData(videoId, process.env.RAPIDAPI_KEY)
      .catch(() => getSubtitlesData(videoId, process.env.RAPIDAPI_KEY_2))
      .catch(() => getSubtitlesData(videoId, process.env.RAPIDAPI_KEY_3))
      .catch(error => {
        console.error(error);
        throw new Error('GENERATION_FAILED');
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
      .parse(data);

    if (subtitles.length === 0) throw new Error('NO_CAPTIONS');

    const transcript = subtitles.map(subtitle => subtitle.text).join(' ');

    return transcript.trim().replace(/\[[^\]]*\]/g, '');
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      throw new Error('BAD_REQUEST');
    }

    throw err;
  }
}

/**
 * @param {string} videoId
 * @param {string | undefined} key
 */
async function getSubtitlesData(videoId, key) {
  if (!key) throw new Error('API_KEY_MISSING');

  const response = await axios.get('https://youtube-v2.p.rapidapi.com/video/subtitles', {
    params: { video_id: videoId },
    headers: {
      'x-rapidapi-host': 'youtube-v2.p.rapidapi.com',
      'x-rapidapi-key': key,
    },
  });

  return response.data.subtitles;
}

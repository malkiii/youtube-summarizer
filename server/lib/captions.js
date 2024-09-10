import axios from 'axios';
import ytdl from '@distube/ytdl-core';
import xml2js from 'xml2js';
import he from 'he';

/**
 * @param {string} videoId - The YouTube video ID
 * @param {string} lang - The language code of the captions to fetch
 * @returns {Promise<string>}
 */
export async function getVideoTranscript(videoId, lang = 'en', retries = 0) {
  if (retries > 2) throw new Error('BAD_REQUEST');

  try {
    // // Fetch the video page HTML
    // const html = await fetchHTML(`https://www.youtube.com/watch?v=${videoId}`);

    // // Extract the JSON data from the HTML
    // const ytInitialPlayerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.*?\});/);
    // if (!ytInitialPlayerResponseMatch) throw new Error('UNREACHABLE');

    // const playerResponse = JSON.parse(ytInitialPlayerResponseMatch[1]);

    const info = await ytdl.getInfo(videoId, {
      agent: ytdl.createAgent(JSON.parse(process.env.YOUTUBE_COOKIE), { pipelining: 5 }),
      requestOptions: {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.youtube.com/',
        },
      },
    });

    const playerResponse = info?.player_response;

    // Check if the video is playable or exists
    if (playerResponse.playabilityStatus.status !== 'OK') throw new Error('UNREACHABLE');

    // Get caption tracks from the JSON data
    const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!captionTracks || captionTracks.length === 0) throw new Error('NO_CAPTIONS');

    // Find the caption track with the specified language code
    let selectedCaptionTrack = captionTracks.find(track => {
      return track.languageCode.startsWith(lang) || lang.startsWith(track.languageCode);
    });

    // If no caption track for the specified language, default to the first one
    if (!selectedCaptionTrack) selectedCaptionTrack = captionTracks[0];

    const captionUrl = selectedCaptionTrack.baseUrl;

    // Fetch the captions
    const captionsResponse = await axios.get(captionUrl);

    // Parse the XML captions to JSON
    const result = await xml2js.parseStringPromise(captionsResponse.data, { async: true });

    // Access the transcript and return it
    const transcript = result?.transcript.text.map(item => item._).join(' ');

    return cleanTranscript(transcript);
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      throw new Error('BAD_REQUEST');
    }

    // handle network errors for transcript fetching
    if (err instanceof TypeError) {
      return getVideoTranscript(videoId, lang, retries + 1);
    }

    throw err;
  }
}

/**
 * @param {string} url - The URL to fetch
 * @returns {Promise<string>}
 */
async function fetchHTML(url) {
  const scrape = key => {
    if (!key) throw new Error('API_KEY_MISSING');

    return axios.get('https://api.webscrapingapi.com/v2', {
      params: { url, api_key: key },
    });
  };

  try {
    const response = await scrape(process.env.WEB_SCRAPING_API_KEY)
      .catch(() => scrape(process.env.WEB_SCRAPING_API_KEY_2))
      .catch(() => scrape(process.env.WEB_SCRAPING_API_KEY_3));

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('GENERATION_FAILED');
  }
}

function cleanTranscript(transcript) {
  return he
    .decode(transcript)
    .replace(/\[[^\]]*\]/g, '')
    .trim();
}

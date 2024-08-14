import axios from 'axios';
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
    // Fetch the video page HTML
    const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const videoPageResponse = await axios.get(videoPageUrl);
    const html = videoPageResponse.data;

    // Extract the JSON data from the HTML
    const ytInitialPlayerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.*?\});/);
    if (!ytInitialPlayerResponseMatch) throw new Error('UNREACHABLE');

    const playerResponse = JSON.parse(ytInitialPlayerResponseMatch[1]);

    // Get caption tracks from the JSON data
    const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!captionTracks || captionTracks.length === 0) throw new Error('NO_CAPTIONS');

    // Find the caption track with the specified language code
    let selectedCaptionTrack = captionTracks.find(track => track.languageCode.startsWith(lang));

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

function cleanTranscript(transcript) {
  return he
    .decode(transcript)
    .replace(/\[[^\]]*\]/g, '')
    .trim();
}

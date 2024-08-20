import youtubedl from 'youtube-dl-exec';
import axios from 'axios';

export async function getCaptions(videoId, lang = 'en') {
  try {
    // Run youtube-dl-exec to get the subtitle URL
    const result = await youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {
      allSubs: true,
      skipDownload: true,
      dumpSingleJson: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
      noWarnings: true,
    });

    // Extract the URL from the result
    return Object.keys(result.automatic_captions);
  } catch (error) {
    throw new Error('UNREACHABLE');
  }
}

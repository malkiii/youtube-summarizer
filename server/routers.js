import { getVideoTranscript } from './lib/captions.js';
import { generateContent, getSummerizeInstruction } from './lib/gemini.js';
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

/** @type {Router} */
export async function summerizeYoutubeVideo(req, res) {
  try {
    const params = z
      .object({ videoId: z.string(), lang: z.enum(Object.keys(languages)) })
      .safeParse(req.query);

    if (!params.success) return res.status(400).json({ type: 'INVALID_DATA' });

    // const transcript = await getVideoTranscript(params.data.videoId, params.data.lang);
    // const summary = await generateContent(
    //   getSummerizeInstruction(languages[params.data.lang], transcript),
    // );

    await new Promise(res => setTimeout(res, 5000));

    const summary = `\
## Progressive Web Applications (PWAs): A Guide to Understanding and Building Them

Progressive Web Applications (PWAs) are web apps designed to function like native mobile apps across any device. They aim to deliver high-performance websites with app-like user experiences.

**PWAs offer several benefits:**

* **App-like experience:** PWAs can hide \`browser\` controls, providing a native app feel.
* **SEO-friendly:** PWAs are indexable by search engines and can be optimized for search.
* **Fast and offline functionality:** PWAs can load quickly and function even with poor network connections.
* **Push notifications:** PWAs can send notifications to users, keeping them engaged.
* **Device feature utilization:** PWAs can access device features like location and camera.

**Characteristics of a PWA:**

* **Discoverable:** PWAs and their pages can be found through search engines (SEO friendly).
* **Installable:** PWAs can be added to a device's home screen for easy access.
* **Linkable:** PWAs and their pages can be shared through URLs.
* **Network independent:** PWAs can work offline or with poor network connections.
* **Progressively enhanced:** PWAs remain usable on older browsers.
* **Re-engageable:** PWAs can notify users about new content or updates.
* **Responsive design:** PWAs adapt to different screen sizes and devices.
* **Secure:** PWAs use HTTPS to protect communications between users, apps, and servers.

**Architectural Enablers:**

* **Manifest file:** A JSON file defining how the PWA is treated as an installed application, including its appearance and behavior.
* **Service worker:** A script that handles network requests and caching, enabling offline functionality and push notifications.
* **HTTPS:** Secure communication protocol for all connections.
* **Modern JavaScript frameworks:** Frameworks like React and Vue provide tools to build PWAs adhering to PWA principles.

**Frameworks and Tools:**

* **Gatsby, Next, Nuxt:** Frameworks that provide PWA features out-of-the-box.
* **Lighthouse:** A tool in Chrome that analyzes page quality and PWA compliance.

**Conclusion:**

PWAs offer significant advantages for businesses and users, providing a seamless and engaging experience. Understanding the guiding principles and architectural enablers is crucial for successfully building and deploying PWAs.    
`;

    res.status(200).end(summary);
  } catch (error) {
    if (error.message) res.status(400).json({ type: error.message });
    else res.status(500).json({ type: 'SERVER_ERROR' });
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

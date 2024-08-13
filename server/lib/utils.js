import path from 'node:path';
import { minify } from 'html-minifier';

export function getAbsolutePath(filePath = '.') {
  return path.resolve(import.meta.dirname, '../../', filePath);
}

export function minifyHTML(html) {
  return minify(html, {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    minifyCSS: true,
    minifyJS: true,
  });
}

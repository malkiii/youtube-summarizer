import path from 'node:path';

export function getAbsolutePath(filePath = '.') {
  return path.resolve(import.meta.dirname, '../../', filePath);
}

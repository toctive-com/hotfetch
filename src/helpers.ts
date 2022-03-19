import { createServer } from 'http';

/**
 * Checks if a string is a valid URL
 * @param {string} url - The URL to check.
 * @returns A boolean value.
 */
export const isValidURL = (url: string) => {
  const protocols = ['http:', 'https:'];
  try {
    if (protocols.includes(new URL(url).protocol)) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const stringToHTML = (content:string) => `<html><head></head><body>${content}</body></html>`;

export function makeHTTPServer(content: string, port: number = 8000) {
  return createServer({}, (_req, res) => {
    res.writeHead(200);
    res.end(stringToHTML(content));
  }).listen(port);
}

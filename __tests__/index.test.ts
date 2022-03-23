import {
  afterEach,
  beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  createHttpTerminator,
  HttpTerminator,
} from 'http-terminator';

import { makeHTTPServer } from '../src/helpers';

import HotFetch from '../src/index';

describe('Test Loading And Extracting Data From URLs And HTML Content As String', () => {
  let HF: HotFetch;

  /* contain a random port [1024 : 25000] because the server throws an error cause
   `port already in use` */
  let randomPort: number;

  /* This variable is used to store the server object so we can stop it after every test. */
  let server: HttpTerminator;

  /**
   * It creates a server that listens on a random port and returns the given HTML content
   * @param {string} htmlContent - The HTML content to serve.
   * @returns A function that returns a promise.
   */
  function createServer(htmlContent: string) {
    return createHttpTerminator({ server: makeHTTPServer(htmlContent, randomPort) });
  }

  beforeEach(() => {
    // Create new HotFetch object for every test
    HF = new HotFetch();
    randomPort = Math.floor(Math.random() * 25000 + 1024);
  });

  describe('Load Data From URLs', () => {
    it('loads data from text content', () => {
      const htmlContent = '<p>Paragraph</p>';
      HF.loadHTML(htmlContent);

      expect(HF.getHTML()).toBe(`<html><head></head><body>${htmlContent}</body></html>`);
    });

    it('loads from URL', async () => {
      // Create Server to simulate making http request using axios
      const htmlContent = 'Some Content';
      server = createServer(htmlContent);
      await HF.loadFromURL(`http://localhost:${randomPort}/`);

      expect(HF.getHTML()).toBe(`<html><head></head><body>${htmlContent}</body></html>`);
    });

    it('use not valid URL', async () => {
      // Create Server to simulate making http request using axios
      const htmlContent = 'Some Content';
      server = createServer(htmlContent);

      await expect(HF.loadFromURL(`http://localhost:${randomPort}/`)).resolves.not.toThrow();
      await expect(HF.loadFromURL('not valid URL')).rejects.toThrow();
    });
  });

  describe('Extract Text From Elements', () => {
    it('extracts text from one element', async () => {
      // Create Server to simulate making http request using axios
      const htmlContent = '<h1 class="title">Some Content</h1>';
      server = createServer(htmlContent);

      await HF.loadFromURL(`http://localhost:${randomPort}/`);
      const result = HF.extract({
        headings: { selector: 'h1', get: 'text' },
      });

      expect(result).toEqual({ headings: 'Some Content' });
    });

    it.todo('get text without passing a `get` key one element');
    it.todo('get html source code from one element');

    it('extracts text from list of elements', async () => {
      // Create Server to simulate making http request using axios
      const htmlContent = '<h1 class="title">Heading Content</h1><p>Paragraph Content</p>';
      server = createServer(htmlContent);

      await HF.loadFromURL(`http://localhost:${randomPort}/`);
      const result = HF.extract({
        headings: { selector: ['h1.title', 'p'], get: 'text' },
      });

      expect(result).toEqual({ headings: ['Heading Content', 'Paragraph Content'] });
    });
  });

  describe('Extract Attributes From Elements', () => {
    it('extracts list of attributes from one element', async () => {
      // Create Server to simulate making http request using axios
      const htmlContent = '<h1 class="title" data-temp="hello">Some Content</h1>';
      server = createServer(htmlContent);

      await HF.loadFromURL(`http://localhost:${randomPort}/`);
      const result = HF.extract({
        headings: { selector: '.title', get: ['class', 'data-temp'] },
      });

      expect(result.headings).toContain('hello');
      expect(result.headings).toContain('title');
      expect(result.headings).toHaveLength(2);
    });

    it('extracts list of attributes from list of elements', async () => {
      // Create Server to simulate making http request using axios
      const htmlContent = '<h1 class="title" data-temp="hello">Some Content</h1><p class="text-lg">Some Content</p>';
      server = createServer(htmlContent);

      await HF.loadFromURL(`http://localhost:${randomPort}/`);
      const result = HF.extract({
        headings: { selector: ['p', '.title'], get: ['class', 'data-temp'] },
      });

      expect(result.headings).toContain('hello');
      expect(result.headings).toContain('title');
      expect(result.headings).toContain('text-lg');
      expect(result.headings).toHaveLength(3);
    });
  });

  afterEach(() => server?.terminate());
});

import { describe, expect, it } from '@jest/globals';
import axios from 'axios';
import { Server } from 'http';
import {
  createHttpTerminator,
} from 'http-terminator';
import { stringToHTML, isValidURL, makeHTTPServer } from '../src/helpers';

describe('Test Helper Functions', () => {
  it('stringToHTML takes element and return full HTML page', () => {
    const HTMLContent = '<h1>Hello, World!</h1>';
    expect(stringToHTML(HTMLContent)).toBe(`<html><head></head><body>${HTMLContent}</body></html>`);
  });

  describe('Test making local server', () => {
    it('check if the server was created', async () => {
      const HTMLContent = '<h1>Hello, World!</h1>';
      const port = 9888;
      const received = makeHTTPServer(HTMLContent, port);

      expect(received).toBeInstanceOf(Server);
      const res = await axios.get(`http://localhost:${port}`);
      expect(res.status).toBe(200);

      // we don't want to block the port on localhost. so, we should terminate the server
      createHttpTerminator({ server: received }).terminate();
    });

    it('passes wrong values to makeHTTPServer method', async () => {
      const HTMLContent = '<h1>Hello, World!</h1>';
      const received = makeHTTPServer(HTMLContent);

      expect(received).toBeInstanceOf(Server);
      const res = await axios.get('http://localhost:8000');
      expect(res.status).toBe(200);

      // we don't want to block the port on localhost. so, we should terminate the server
      createHttpTerminator({ server: received }).terminate();
    });
  });

  describe('uses invalid URL', () => {
    it('uses text instead of valid URL', () => {
      expect(isValidURL('not valid')).toBe(false);
    });

    it('uses invalid URL protocol (FTP)', () => {
      expect(isValidURL('ftp://google.com/')).toBe(false);
    });
  });
});

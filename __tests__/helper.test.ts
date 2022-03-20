import { describe, expect, it } from '@jest/globals';
import { stringToHTML, isValidURL } from '../src/helpers';

describe('Test Helper Functions', () => {
  it('stringToHTML takes element and return full HTML page', () => {
    const HTMLContent = '<h1>Hello, World!</h1>';
    expect(stringToHTML(HTMLContent)).toBe(`<html><head></head><body>${HTMLContent}</body></html>`);
  });

  it('uses invalid URL', () => {
    expect(isValidURL('not valid')).toBe(false);
  });
});

import {
  beforeEach, describe, expect, it,
} from '@jest/globals';

import HotFetch from '../src/index';

describe('load data from text', () => {
  let HF: HotFetch;

  beforeEach(() => {
    // Create new HotFetch object
    HF = new HotFetch();
  });

  it('loads data from text content', () => {
    HF.loadHTML('content');
    expect(HF.html).toBe('content');
  });
});

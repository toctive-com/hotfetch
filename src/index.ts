import axios from 'axios';
import $, { CheerioAPI, BasicAcceptedElems } from 'cheerio';
import { isValidURL } from './helpers';

interface optionsObject {
  [key: string]: {
    selector: string | Array<string> | BasicAcceptedElems<any>,
    get: Array<string> | string
  }
}

class HotFetch {
  private html: any;

  $: CheerioAPI;

  constructor() {
    this.html = '';
    this.$ = $;
  }

  /**
   * Loads HTML into the DOM
   * @param {string} html - The HTML to be loaded.
   * @returns The HTML string.
   */
  loadHTML(html: string) {
    this.$ = $.load(html);
    this.html = this.$.html();
    return this.html;
  }

  /**
   * If the URL is valid, then load the HTML from the URL. Otherwise, throw an error
   * @param {string} url - The URL of the HTML page to load.
   * @returns Nothing.
   */
  async loadURL(url: string, ...rest:any) {
    if (isValidURL(url)) {
      const res = await axios.get(url, ...rest);
      return this.loadHTML(res.data);
    }

    throw new Error(`${url} is not valid URL. please use a valid URL.`);
  }

  /* This is a getter for the HTML content. */
  content() {
    return this.html;
  }

  /**
   * It takes in an object of options, and returns an object of extracted data
   * @param {optionsObject} options - Object
   * @returns A dictionary of the extracted data.
   */
  extract(options: optionsObject) {
    const result: any = {};

    Object.keys(options).forEach((key) => {
      const { selector } = options[key];
      const attrs = options[key].get;
      const selected = this.$(selector);
      result[key] = null;

      if (Array.isArray(selector)) {
        result[key] = [];

        if (Array.isArray(attrs)) {
          attrs.forEach((attr) => {
            // Todo: check if the attr is 'text' | 'html' to load text or html only
            selected.each((_i, ele) => {
              const attrValue = this.$(ele).attr(attr);
              if (!attrValue) return;
              result[key].push(attrValue);
            });
          });
        } else if (attrs === 'text') {
          selected.each((_i, ele) => { result[key].push(this.$(ele).text().trim()); });
        } else {
          result[key].push(selected.attr(attrs));
        }
      } else if (Array.isArray(attrs)) {
        attrs.forEach((attr) => {
          result[key] = result[key] === null ? [] : result[key];
          // Todo: check if the attr is 'text' | 'html' to load text or html only
          result[key].push(selected.attr(attr));
        });
      } else if (attrs === 'text') {
        result[key] = selected.text().trim();
      } else {
        result[key] = selected.attr(attrs);
      }
    });

    return result;
  }
}

export default HotFetch;

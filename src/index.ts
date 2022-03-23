/* eslint-disable no-console */
import axios from 'axios';
import $, { CheerioAPI, BasicAcceptedElems } from 'cheerio';
import { isValidURL } from './helpers';

interface elementsObject {
  [key: string]: {
    selector: string | Array<string> | BasicAcceptedElems<any>,
    get?: Array<string> | string,
    options?: Object,
    callback?: Function
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
  async loadFromURL(url: string, ...rest:any) {
    if (isValidURL(url)) {
      const res = await axios.get(url, ...rest);
      return this.loadHTML(res.data);
    }

    throw new Error(`${url} is not valid URL. please use a valid URL.`);
  }

  /* This is a getter for the HTML content. */
  getHTML() {
    return this.html;
  }

  protected getAttributesFromElement(element: any, attributes: string[]): string[] {
    const foundAttributesInElement: string[] = [];

    // search for every attribute in single element
    attributes.forEach((attribute) => {
      const foundValues: string[] = [];

      if (attribute.toLowerCase() === 'text') {
        const value = this.$(element).text().replace(/\s+/g, ' ').trim();
        if (value !== '') foundValues.push(value);
      } else if (attribute.toLowerCase() === 'html') {
        // method html may return null if it cannot find the element we looking for.
        // so that, we store the returned value in a temp variable and check
        // its value before assign it to `foundAttribute` variable
        const foundAttributeTemp = this.$(element).html();
        if (foundAttributeTemp !== null) foundValues.push(foundAttributeTemp);
      } else {
        // method attr may return undefined if the element does NOT have the attribute
        // we looking for. so that, we store the returned value in a temp variable and check
        // its value before assign it to `foundAttribute` variable
        const foundAttributeTemp = this.$(element).attr(attribute);

        // sometimes the element does NOT contain the wanted attribute
        // so we must check if the returned attribute is undefined or not before storing it
        if (foundAttributeTemp !== undefined) {
          foundValues.push(foundAttributeTemp);
        }
      }

      // we don't want to include empty strings in the final result
      foundValues.forEach((value) => { foundAttributesInElement.push(value); });
    });

    return foundAttributesInElement;
  }

  /**
   * For every element in the selected elements, we search for the wanted attributes and store them
   * in the result array
   * @param {any[]} selectedElements - an array of elements that we want to get attributes from
   * @param {string[]} wantedAttributes - an array of attributes that we want to find in the
   * selected elements
   * @returns The result array contains an array of attributes for each element.
   */
  private getAttributes(
    selectedElements: any[],
    wantedAttributes: string[],
  ) {
    // Here we'll store all attribute found in the selected elements
    const result: string[][] = [];

    // loop over every element of the selected elements
    selectedElements.forEach((selectedElement) => {
      // every element will contain some attributes and we store them here
      // search for every attribute in single element
      const foundAttributesInElement: string[] = this.getAttributesFromElement(
        selectedElement,
        wantedAttributes,
      );

      if (foundAttributesInElement.length !== 0) result.push(foundAttributesInElement);
    });

    // return the final array of attributes we found of every element
    // we should return a single array not a nested arrays, so, we use flat method to do so.
    return result.flat();
  }

  /**
   * It takes in an object of options, and returns an object of extracted data
   * @param {elementsObject} elements - Object
   * @returns A dictionary of the extracted data.
   */
  extract(elements: elementsObject) {
    const result: {[key: string]: string | any[]} = {};

    // for every item in elements
    Object.keys(elements).forEach((key) => {
      const { selector: requestedSelectors } = elements[key];
      const requestedAttributes = elements[key].get || 'text';
      let selectorsAsArray = requestedSelectors;

      // if the user used a single string like 'text' or 'class', convert it to array of strings
      const attributesAsArray = Array.isArray(requestedAttributes)
        ? requestedAttributes : [requestedAttributes];

      // sometimes the $ object could return a single element
      if (!Array.isArray(requestedSelectors)) { selectorsAsArray = [selectorsAsArray]; }

      result[key] = this.getAttributes(selectorsAsArray, attributesAsArray);

      // if the selector and attributes are NOT arrays then return only the first result
      if (!Array.isArray(requestedSelectors) && !Array.isArray(requestedAttributes)) {
        result[key] = result[key].at(0);
      }
    });

    return result;
  }
}

export default HotFetch;

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable no-console */
import axios from 'axios';
import $ from 'cheerio';
import { isValidURL } from './helpers';
class HotFetch {
    constructor() {
        this.html = '';
        this.$ = $;
        this.result = {};
    }
    /**
     * Loads HTML into the DOM
     * @param {string} html - The HTML to be loaded.
     * @returns The HTML string.
     */
    loadHTML(html) {
        this.$ = $.load(html);
        this.html = this.$.html();
        return this.html;
    }
    /**
     * If the URL is valid, then load the HTML from the URL. Otherwise, throw an error
     * @param {string} url - The URL of the HTML page to load.
     * @returns Nothing.
     */
    loadFromURL(url, ...rest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isValidURL(url)) {
                const res = yield axios.get(url, ...rest);
                return this.loadHTML(res.data);
            }
            throw new Error(`${url} is not valid URL. please use a valid URL.`);
        });
    }
    /* This is a getter for the HTML content. */
    getHTML() {
        return this.html;
    }
    /**
     * It takes an element and an array of attributes, and returns an array of all the values of the
     * attributes found in the element
     * @param {any} element - The element we want to search for attributes in.
     * @param {string[]} attributes - an array of attributes to search for in the elements.
     * @returns The method returns an array of strings.
     */
    getAttributesFromElement(element, attributes) {
        const foundAttributesInElement = [];
        // search for every attribute in single element
        attributes.forEach((attribute) => {
            const foundValues = [];
            if (attribute.toLowerCase() === 'text') {
                foundValues.push(this.$(element).text().replace(/\s+/g, ' ').trim());
            }
            else if (attribute.toLowerCase() === 'html') {
                // method html may return null if it cannot find the element we looking for.
                // so that, we store the returned value in a temp variable and check
                // its value before assign it to `foundAttribute` variable
                foundValues.push(this.$(element).html());
            }
            else {
                // method attr may return undefined if the element does NOT have the attribute
                // we looking for. so that, we store the returned value in a temp variable and check
                // its value before assign it to `foundAttribute` variable
                const foundAttributeTemp = this.$(element).attr(attribute);
                // sometimes the element does NOT contain the wanted attribute
                // so we must check if the returned attribute is undefined or not before storing it
                if (foundAttributeTemp !== undefined)
                    foundValues.push(foundAttributeTemp);
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
    getAttributes(selectedElements, wantedAttributes) {
        // if there is only one element
        if (!Array.isArray(selectedElements)) {
            return this.getAttributesFromElement(selectedElements, wantedAttributes);
        }
        // Here we'll store all attribute found in every selected element
        const attributes = [];
        // loop over every element of the selected elements
        selectedElements.forEach((element) => {
            // every element will contain some attributes and we store them here
            // search for every attribute in single element
            const foundAttributesInElement = this.getAttributesFromElement(element, wantedAttributes);
            attributes.push(...foundAttributesInElement);
        });
        // return the final array of attributes we found of every element
        // we should return a single array not a nested arrays, so, we use flat method to do so.
        return attributes;
    }
    /**
     * Select only the elements we will work on.
     * @param selector
     * @param isArray
     * @returns Cheerio: one element or an array of elements
     */
    getElements(selector, isArray = false) {
        var _a, _b, _c, _d, _e, _f, _g;
        // we store the selected elements here
        let selectedElements;
        // if there are multiple selectors
        if (Array.isArray(selector)) {
            selectedElements = selector
                .map((oneSelector) => this.$(oneSelector));
            // sometimes we can get multiple element with one selector
            // so that, we need to extract every element on the same selector to one array
            let flattedElements = [];
            selectedElements.forEach((ele) => flattedElements.push(...ele.toArray()));
            // reverse order of the elements
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.reverse) {
                flattedElements.reverse();
            }
            // get only the limit of elements instead of all elements
            if ((_b = this.options) === null || _b === void 0 ? void 0 : _b.limit) {
                flattedElements = flattedElements.slice(0, (_c = this.options) === null || _c === void 0 ? void 0 : _c.limit);
            }
            return flattedElements;
        }
        // if there is only one selector, get all elements with that selector
        selectedElements = this.$(selector);
        // if the user want an array of elements
        if (isArray) {
            selectedElements = selectedElements.toArray();
            // reverse the order of the elements
            if ((_d = this.options) === null || _d === void 0 ? void 0 : _d.reverse) {
                selectedElements.reverse();
            }
            // get only the limit of elements instead of all elements
            if ((_e = this.options) === null || _e === void 0 ? void 0 : _e.limit) {
                selectedElements = selectedElements.slice(0, (_f = this.options) === null || _f === void 0 ? void 0 : _f.limit);
            }
            return selectedElements;
        }
        // get last element if the user sets reverse option to true
        return (((_g = this.options) === null || _g === void 0 ? void 0 : _g.reverse)
            ? selectedElements.get(-1) : selectedElements.get(0));
    }
    /**
     * It takes in an object of options, and returns an object of extracted data
     * @param {elementsObject} elements - Object
     * @returns A dictionary of the extracted data.
     */
    extract(elements) {
        // for every element in elements
        Object.keys(elements).forEach((key) => {
            const elementIsArray = Array.isArray(elements[key]);
            const element = elementIsArray
                ? elements[key][0] : elements[key];
            // store the options of the current element in a class attribute
            this.options = element.options || {};
            const selectedElements = this.getElements(element.selector, Array.isArray(elements[key]));
            const requestedAttributes = element.get || 'text';
            // if the user used a single string like 'text' or 'class', convert it to array of strings
            const attributesAsArray = Array.isArray(requestedAttributes)
                ? requestedAttributes : [requestedAttributes];
            const foundAttributes = this.getAttributes(selectedElements, attributesAsArray);
            // if the selector and attributes are NOT arrays then return only the first result
            if (Array.isArray(element.selector)
                || Array.isArray(requestedAttributes)
                || Array.isArray(elements[key])) {
                this.result[key] = foundAttributes;
            }
            else {
                this.result[key] = (foundAttributes === null || foundAttributes === void 0 ? void 0 : foundAttributes.at(0)) || null;
            }
            // execute the callback if it exists
            if (typeof element.callback !== 'undefined') {
                this.result[key] = element.callback(this.result[key]);
            }
        });
        return this.result;
    }
}
export default HotFetch;

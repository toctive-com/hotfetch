# hotfetch
Scrape pages and extract data in ease

## Get Started
Here is a simple explanation to start using HotFetch without a problem

### Installing
First you have to install the package through one of the following commands:
```bash
npm i hotfetch

# or with Yarn
yarn add hotfetch
```

If you encounter a problem with temporary files or any other problem with the installation process, you can install HotFetch through one of the following commands:
```bash
npm i toctive-com/hotfetch

# or with Yarn
yarn add toctive-com/hotfetch
```
You will get the same result in the end as both packages HotFetch and toctive-com/hotfetch contain exactly the same code but both in different registry
- hotfetch in NPM Registry
- toctive-com/hotfetch in GitHub Packages Registry (GPR)

### How to use 
First import HotFetch class from hotfetch and create a new instance:
```javascript
const HotFetch = require('hotfetch');
const hf = new HotFetch();

// download the HTML content of a web page
hf.loadFromURL('https://stackoverflow.com/questions');

// structure of the data you want to get
const result = hf.extract({
  title: { selector: '#mainbar > div.d-flex > h1', Options: { limit: 1 } },
});

console.log(result);  // { title: "All Questions" }
```

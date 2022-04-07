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

#### basics

First import HotFetch class from hotfetch and create a new instance:

```javascript
import axios from "axios";
import HotFetch from "hotfetch";

// download the HTML content of a web page
axios.get("https://stackoverflow.com/questions").then((res) => {
  const hf = new HotFetch();
  hf.loadHTML(res.data);

  // structure of the data you want to get
  const result = hf.extract({
    title: { selector: "h1" },
  });

  console.log(result); // { title: All Questions }
});
```

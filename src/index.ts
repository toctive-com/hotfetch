class HotFetch {
  html: string;

  constructor() {
    this.html = '';
  }

  loadHTML(html: string) {
    this.html = html;
  }

  content() {
    return this.html;
  }
}

export default HotFetch;

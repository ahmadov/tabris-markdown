# Tabris.js markdown parser

![Test](https://github.com/ahmadov/tabris-markdown/workflows/Test/badge.svg)

Parse Markdown in a Tabris.js app, safely ignoring features not supported by the Tabris.js [TextView](https://docs.tabris.com/3.7/api/TextView.html) widget.

Supported features:
- https://www.markdownguide.org/basic-syntax/#headings
- https://www.markdownguide.org/basic-syntax/#paragraphs-1
- https://www.markdownguide.org/basic-syntax/#emphasis
- https://www.markdownguide.org/extended-syntax/#strikethrough
- https://www.markdownguide.org/basic-syntax/#links

### Snippet
```js
new TextView({
  text: new MarkdownParser(text).toHtml(), 
  markupEnabled: true
});
```
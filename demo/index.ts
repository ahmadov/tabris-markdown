import {app, contentView, TextView} from 'tabris';
import {MarkdownParser} from '../src';

const text = `
# header 1
## header 2
### header 3
#### header 4
##### header 5
###### header 6

header
======
some text

[Tabris.js docs link.](https://docs.tabris.com)

This is the first line.
And this is the second line.

I just love **bold text**.
I just love __bold text__.

I also love *italic text*.
I also love _italic text_.

This text is ***really important***.

~~delete this.~~
`;

new TextView({
  layoutData: 'stretchX',
  padding: 8,
  text: new MarkdownParser(text).toHtml(),
  markupEnabled: true
})
.onTapLink(({ url }) => app.launch(url))
.appendTo(contentView);

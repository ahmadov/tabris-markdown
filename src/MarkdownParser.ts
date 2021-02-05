import {TokensList} from 'marked';

interface Token {
  type: string;
  raw: string;
  tokens: Token[];
  text: string;
}

interface HeadingToken extends Token {
  depth: number;
}

interface LinkToken extends Token {
  href: string;
}

enum TokenType {
  Space = 'space',
  Text = 'text',
  Paragraph = 'paragraph',
  Strong = 'strong',
  Emphasize = 'em',
  Del = 'del',
  Heading = 'heading',
  Link = 'link'
}

export class MarkdownParser {

  parse(tokenList: TokensList | Token[]): string {
    const html: string[] = [];
    for (const token of tokenList as Token[]) {
      const parseFunc = this.typeParserMap[token.type];
      if (parseFunc) {
        html.push(parseFunc(token));
      } else {
        console.error(`[warning] unrecognized type '${token.type}'`, token);
        html.push(this.replaceLineEndings(token.raw));
      }
    }
    return html.join('');
  }

  private parseText = (token: Token): string => {
    return this.replaceLineEndings(token.raw);
  }

  private parseParagraph = (token: Token): string => {
    return this.parse(token.tokens);
  }

  private parseStrong = (token: Token): string => {
    return `<b>${this.parse(token.tokens)}</b>`;
  }

  private parseEmphasize = (token: Token): string => {
    return `<em>${this.parse(token.tokens)}</em>`;
  }

  private parseDel = (token: Token): string => {
    return `<del>${this.parse(token.tokens)}</del>`;
  }

  private parseHeading = (token: HeadingToken): string => {
    const fontSize = this.calculateFontSizeForHeading(token.depth);
    return `<span font='bold ${fontSize}px'>${this.parse(token.tokens)}</span><br/>`;
  }

  private parseLink = (token: LinkToken): string => {
    return `<a href="${token.href}">${this.parse(token.tokens)}</a>`;
  }

  private replaceLineEndings(text: string): string {
    return text.replace(/\n/g, '<br/>');
  }

  private calculateFontSizeForHeading(headingDepth: number): number {
    return Math.max(20 - 2 * (headingDepth - 1), 10);
  }

  private readonly typeParserMap: {[type: string]: (token: Token) => string} = {
    [TokenType.Space]: this.parseText,
    [TokenType.Text]: this.parseText,
    [TokenType.Paragraph]: this.parseParagraph,
    [TokenType.Strong]: this.parseStrong,
    [TokenType.Emphasize]: this.parseEmphasize,
    [TokenType.Del]: this.parseDel,
    [TokenType.Heading]: this.parseHeading,
    [TokenType.Link]: this.parseLink
  };

}

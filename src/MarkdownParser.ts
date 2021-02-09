import {Lexer, TokensList} from 'marked';
import {Listeners} from 'tabris';
import {event} from 'tabris-decorators';

interface MarkedToken {
  type: string;
  raw: string;
  tokens: MarkedToken[];
  text: string;
}

interface HeadingToken extends MarkedToken {
  depth: number;
}

interface LinkToken extends MarkedToken {
  href: string;
}

export enum TokenType {
  Space = 'space',
  Text = 'text',
  Paragraph = 'paragraph',
  Strong = 'strong',
  Emphasize = 'em',
  Del = 'del',
  Heading = 'heading',
  Link = 'link'
}

export interface Token {
  type: TokenType;
  depth?: number;
  href?: string;
}

export interface TokenWithValue extends Token {
  value: string;
}

interface MarkdownToFunc {
  parse: (token: MarkedToken) => void;
  toHtml: (token: MarkedToken) => string;
}

export class MarkdownParser {

  @event public onText: Listeners<{token: TokenWithValue, target: MarkdownParser}>;
  @event public onBegin: Listeners<{token: Token, target: MarkdownParser}>;
  @event public onEnd: Listeners<{token: Token, target: MarkdownParser}>;

  private tokens: TokensList | MarkedToken[];

  constructor(text: string) {
    this.tokens = new Lexer().lex(text);
  }

  parse(): void {
    this._parse(this.tokens as MarkedToken[]);
  }

  toHtml(): string {
    return this._toHtml(this.tokens as MarkedToken[]);
  }

  private _parse(tokens: MarkedToken[]): void {
    for (const token of tokens) {
      const markdownToken = this.typeMarkdownMap[token.type];
      if (markdownToken) {
        markdownToken.parse(token);
      } else {
        console.error(`[warning] unrecognized type '${token.type}'`, token);
        this.onText.trigger({token: {type: TokenType.Text, value: token.raw}});
      }
    }
  }

  private _toHtml(tokens: MarkedToken[]): string {
    const html: string[] = [];
    for (const token of tokens) {
      const markdownToken = this.typeMarkdownMap[token.type];
      if (markdownToken) {
        html.push(markdownToken.toHtml(token));
      } else {
        console.error(`[warning] unrecognized type '${token.type}'`, token);
        html.push(this.replaceLineEndingsToHtmlBreak(token.raw));
      }
    }
    return html.join('');
  }

  private parseText = (token: MarkedToken): void => {
    this.onText.trigger({token: {type: TokenType.Text, value: token.raw}});
  }

  private parseParagraph = (token: MarkedToken): void => {
    this.onBegin.trigger({token: {type: TokenType.Paragraph}});
    this._parse(token.tokens);
    this.onEnd.trigger({token: {type: TokenType.Paragraph}});
  }

  private parseStrong = (token: MarkedToken): void => {
    this.onBegin.trigger({token: {type: TokenType.Strong}});
    this._parse(token.tokens);
    this.onEnd.trigger({token: {type: TokenType.Strong}});
  }

  private parseEmphasize = (token: MarkedToken): void => {
    this.onBegin.trigger({token: {type: TokenType.Emphasize}});
    this._parse(token.tokens);
    this.onEnd.trigger({token: {type: TokenType.Emphasize}});
  }

  private parseDel = (token: MarkedToken): void  =>{
    this.onBegin.trigger({token: {type: TokenType.Del}});
    this._parse(token.tokens);
    this.onEnd.trigger({token: {type: TokenType.Del}});
  }

  private parseHeading = (token: HeadingToken): void => {
    this.onBegin.trigger({token: {type: TokenType.Heading, depth: token.depth},});
    this._parse(token.tokens);
    this.onEnd.trigger({token: {type: TokenType.Heading}});
  }

  private parseLink = (token: LinkToken): void => {
    this.onBegin.trigger({token: {type: TokenType.Link, href: token.href}});
    this._parse(token.tokens);
    this.onEnd.trigger({token: {type: TokenType.Link}});
  }

  private toHtmlText = (token: MarkedToken): string => {
    return this.replaceLineEndingsToHtmlBreak(token.raw);
  }

  private toHtmlParagraph = (token: MarkedToken): string => {
    return this._toHtml(token.tokens);
  }

  private toHtmlStrong = (token: MarkedToken): string => {
    return `<b>${this._toHtml(token.tokens)}</b>`;
  }

  private toHtmlEmphasize = (token: MarkedToken): string => {
    return `<em>${this._toHtml(token.tokens)}</em>`;
  }

  private toHtmlDel = (token: MarkedToken): string => {
    return `<del>${this._toHtml(token.tokens)}</del>`;
  }

  private toHtmlHeading = (token: HeadingToken): string => {
    const fontSize = this.calculateFontSizeForHeading(token.depth);
    const newLineBreak = token.raw.endsWith('\n') ? '<br/>' : '';
    return `<span font='bold ${fontSize}px'>${this._toHtml(token.tokens)}</span>${newLineBreak}`;
  }

  private toHtmlLink = (token: LinkToken): string => {
    return `<a href="${token.href}">${this._toHtml(token.tokens)}</a>`;
  }

  private replaceLineEndingsToHtmlBreak(text: string): string {
    return text.replace(/\n/g, '<br/>');
  }

  private calculateFontSizeForHeading(headingDepth: number): number {
    return Math.max(20 - 2 * (headingDepth - 1), 10);
  }

  private readonly typeMarkdownMap: {[type: string]: MarkdownToFunc} = {
    [TokenType.Space]: {
      parse: this.parseText,
      toHtml: this.toHtmlText,
    },
    [TokenType.Text]: {
      parse: this.parseText,
      toHtml: this.toHtmlText,
    },
    [TokenType.Paragraph]: {
      parse: this.parseParagraph,
      toHtml: this.toHtmlParagraph,
    },
    [TokenType.Strong]: {
      parse: this.parseStrong,
      toHtml: this.toHtmlStrong,
    },
    [TokenType.Emphasize]: {
      parse: this.parseEmphasize,
      toHtml: this.toHtmlEmphasize,
    },
    [TokenType.Del]: {
      parse: this.parseDel,
      toHtml: this.toHtmlDel,
    },
    [TokenType.Heading]: {
      parse: this.parseHeading,
      toHtml: this.toHtmlHeading,
    },
    [TokenType.Link]: {
      parse: this.parseLink,
      toHtml: this.toHtmlLink,
    }
  };

}

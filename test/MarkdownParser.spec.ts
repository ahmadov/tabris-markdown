import { expect } from './sandbox';
import { MarkdownParser } from '../src/MarkdownParser';

describe('MarkdownParser', () => {

  describe('parse', () => {

    it('parses empty string', () => {
      const result = testInput('');
  
      expect(result).to.equal('');
    });

    it('parses unknown tag as raw string', () => {
      const result = testInput('> bar');
  
      expect(result).to.equal('> bar');
    });
  
    it('parses Markdown without any tags', () => {
      const result = testInput('foo');
  
      expect(result).to.equal('<BEGIN paragraph>foo<END paragraph>');
    });
  
    it('parses Markdown with space', () => {
      const result = testInput('fo o');
  
      expect(result).to.equal('<BEGIN paragraph>fo o<END paragraph>');
    });
  
    it('parses Markdown with line break', () => {
      const result = testInput('fo \no');
  
      expect(result).to.equal('<BEGIN paragraph>fo \no<END paragraph>');
    });
  
    it('parses Markdown with two line breaks', () => {
      const result = testInput('fo \n\no');
  
      expect(result).to.equal('<BEGIN paragraph>fo <END paragraph>\n\n<BEGIN paragraph>o<END paragraph>');
    });
  
    it('parses Markdown with a strong tag', () => {
      const result = testInput('**foo**');
  
      expect(result).to.equal('<BEGIN paragraph><BEGIN strong>foo<END strong><END paragraph>');
    });
  
    it('parses Markdown with a strong tag and a line break', () => {
      const result = testInput('**foo**\nfoo');
  
      expect(result).to.equal('<BEGIN paragraph><BEGIN strong>foo<END strong>\nfoo<END paragraph>');
    });
  
    it('parses Markdown with a strong tag and two line breaks', () => {
      const result = testInput('**foo**\n\nfoo');
  
      expect(result).to.equal('<BEGIN paragraph><BEGIN strong>foo<END strong><END paragraph>\n\n<BEGIN paragraph>foo<END paragraph>');
    });
  
    it('parses Markdown with text preceding a strong tag', () => {
      const result = testInput('bar **foo**');
  
      expect(result).to.equal('<BEGIN paragraph>bar <BEGIN strong>foo<END strong><END paragraph>');
    });
  
    it('parses Markdown with text following a strong tag', () => {
      const result = testInput('**foo** bar');
  
      expect(result).to.equal('<BEGIN paragraph><BEGIN strong>foo<END strong> bar<END paragraph>');
    });
  
    it('parses Markdown with an emphasis tag', () => {
      const result = testInput('*foo*');
  
      expect(result).to.equal('<BEGIN paragraph><BEGIN em>foo<END em><END paragraph>');
    });
  
    it('parses Markdown with nested strong and emphasis tags', () => {
      const result = testInput('_**foo**_');
  
      expect(result).to.equal('<BEGIN paragraph><BEGIN em><BEGIN strong>foo<END strong><END em><END paragraph>');
    });
  
    function testInput(text: string) {
      let result = '';
      new MarkdownParser(text)
        .onBegin(({token}) => result += '<BEGIN ' + token.type + '>')
        .onText(({token}) => result += token.value)
        .onEnd(({token}) => result += '<END ' + token.type + '>')
        .parse();
      return result;
    }
    
  });

  describe('markdownToHtml', () => {

    it('empty string', () => {
      const result = testInput('');

      expect(result).to.equal('');
    });

    it('keeps unknown tag as raw string', () => {
      const result = testInput('> bar');
  
      expect(result).to.equal('> bar');
    });

    it('Markdown without any tags', () => {
      const result = testInput('foo');

      expect(result).to.equal('foo');
    });

    it('Markdown with space', () => {
      const result = testInput('fo o');

      expect(result).to.equal('fo o');
    });

    it('Markdown with line break', () => {
      const result = testInput('fo \no');

      expect(result).to.equal('fo <br/>o');
    });

    it('Markdown with two line breaks', () => {
      const result = testInput('fo \n\no');

      expect(result).to.equal('fo <br/><br/>o');
    });

    it('Markdown with a strong tag', () => {
      const result = testInput('**foo**');

      expect(result).to.equal('<b>foo</b>');
    });

    it('Markdown with a strong tag and a line break', () => {
      const result = testInput('**foo**\nfoo');

      expect(result).to.equal('<b>foo</b><br/>foo');
    });

    it('Markdown with a strong tag and two line breaks', () => {
      const result = testInput('**foo**\n\nfoo');

      expect(result).to.equal('<b>foo</b><br/><br/>foo');
    });

    it('Markdown with text preceding a strong tag', () => {
      const result = testInput('bar **foo**');

      expect(result).to.equal('bar <b>foo</b>');
    });

    it('Markdown with text following a strong tag', () => {
      const result = testInput('**foo** bar');

      expect(result).to.equal('<b>foo</b> bar');
    });

    it('Markdown with an emphasis tag', () => {
      const result = testInput('*foo*');

      expect(result).to.equal('<em>foo</em>');
    });

    it('Markdown with nested strong and emphasis tags', () => {
      const result = testInput('_**foo**_');

      expect(result).to.equal('<em><b>foo</b></em>');
    });

    function testInput(text: string) {
      return new MarkdownParser(text).toHtml();
    }

  });

});

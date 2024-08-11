declare module 'lusha-mock-parser' {
  interface ParseResult {
    html: string;
    links: string[];
  }

  function parse(url: string): ParseResult;

  export = parse;
}

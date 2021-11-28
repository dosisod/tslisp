import tokensToAst from "./ast";
import tokenize from "./tokenize";
import { astToJS } from "./codegen";


const transpileFixture = (code: string): string => {
  const tokens = tokenize(code);
  const astTree = tokensToAst(tokens);

  return astToJS(astTree);
}

describe('codegen', () => {
  it('will transpile simple function call', () => {
    const transpiled = transpileFixture('(f)');

    expect(transpiled).toBe('f();');
  });

  it('will transpile console.log hello world', () => {
    const transpiled = transpileFixture('(console.log "hello world")')

    expect(transpiled).toBe('console.log("hello world");');
  });
});

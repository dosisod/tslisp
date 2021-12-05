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

  it('will transpile basic defconstant', () => {
    const transpiled = transpileFixture('(defconstant pi 3.14)');

    expect(transpiled).toBe('const pi = 3.14;');
  });

  it('will transpile basic defvar', () => {
    const transpiled = transpileFixture('(defvar pi 3.14)');

    expect(transpiled).toBe('let pi = 3.14;');
  });

  it('will transpile defun node', () => {
    const transpiled = transpileFixture('(defun f (x) (defvar y x))');

    expect(transpiled).toBe('const f = (x) => { let y = x; };');
  });
});

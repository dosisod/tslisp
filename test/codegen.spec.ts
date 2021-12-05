import tokensToAst from "../src/ast";
import tokenize from "../src/tokenize";
import { astToJS } from "../src/codegen";


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

  it('will handle built-in operations', () => {
    const opers = {
      // binary
      '(+ 1 2)': '(1 + 2)',
      '(- 1 2)': '(1 - 2)',
      '(* 1 2)': '(1 * 2)',
      '(/ 1 2)': '(1 / 2)',
      '(= 1 2)': '(1 === 2)',
      '(!= 1 2)': '(1 !== 2)',
      '(or 1 2)': '(1 || 2)',
      '(and 1 2)': '(1 && 2)',
      '(xor 1 2)': '(1 ^ 2)',
      '(mod 1 2)': '(1 % 2)',
      '(< 1 2)': '(1 < 2)',
      '(<= 1 2)': '(1 <= 2)',
      '(> 1 2)': '(1 > 2)',
      '(>= 1 2)': '(1 >= 2)',
      '(exp 1 2)': '(1 ** 2)',
      '(rshift 1 2)': '(1 << 2)',
      '(lshift 1 2)': '(1 >> 2)',

      // unary
      '(not 1)': '!1',
      '(neg 1)': '-1',

      // list operators
      '(list 1 2 3 4)': '[1, 2, 3, 4]'
    };

    for (const [key, value] of Object.entries(opers)) {
      const transpiled = transpileFixture(key);

      expect(transpiled).toBe(value);
    }
  });
});

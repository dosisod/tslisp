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

    expect(transpiled).toBe('f()');
  });

  it('will transpile console.log hello world', () => {
    const transpiled = transpileFixture('(console.log "hello world")')

    expect(transpiled).toBe('console.log("hello world")');
  });

  it('will transpile basic defconstant', () => {
    const transpiled = transpileFixture('(defconstant pi 3.14)');

    expect(transpiled).toBe('global.pi = 3.14');
  });

  it('will transpile basic defvar', () => {
    const transpiled = transpileFixture('(defvar pi 3.14)');

    expect(transpiled).toBe('global.pi = 3.14');
  });

  it('will transpile defun node', () => {
    const transpiled = transpileFixture('(defun f (x) (defvar y x))');

    expect(transpiled).toBe('global.f = (x) => ((global.y = x));');
  });

  it('will transpile function with multiple statements in body', () => {
    const transpiled = transpileFixture(
      '(defun f (x) (console.log "hello") (console.log "world"))'
    );

    expect(transpiled).toBe(
      'global.f = (x) => ((console.log("hello")), (console.log("world")));'
    );
  });

  it('will transpile nested expression', () => {
    const transpiled = transpileFixture('(f (g x))');

    expect(transpiled).toBe('f(g(x))');
  });

  it('will parse exit shorthand function', () => {
    const transpiled = transpileFixture('(exit)');

    expect(transpiled).toBe('process.exit(0)');
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
      '(list 1 2 3 4)': '[1, 2, 3, 4]',
      '(filter f l)': 'l.filter(f)',
      '(map f l)': 'l.map(f)',
      '(some f l)': 'l.some(f)',
      '(every f l)': 'l.every(f)',
      '(includes f l)': 'l.includes(f)',

      // misc
      '(set x 3.14)': 'global.x = 3.14',
    };

    for (const [key, value] of Object.entries(opers)) {
      const transpiled = transpileFixture(key);

      expect(transpiled).toBe(value);
    }
  });
});

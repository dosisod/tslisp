import tokenize, { TokenType } from '../src/tokenize';

describe('tokenize', () => {
  it('will parse nothing', () => {
    const tokens = tokenize('');

    expect(tokens.length).toBe(0);
  });

  it('will parse parenthesis', () => {
    const tokens = tokenize('()');

    expect(tokens.length).toBe(2);

    expect(tokens[0].type).toBe(TokenType.OpenParen);
    expect(tokens[0].content).toBe('(');
    expect(tokens[1].type === TokenType.CloseParen);
    expect(tokens[1].content).toBe(')');
  });

  it('will parse numbers', () => {
    const tokens = tokenize('1 3.14 -1234');

    expect(tokens.length).toBe(3);
    expect(tokens.every(token => token.type === TokenType.Number)).toBeTruthy();

    expect(tokens[0].content).toBe('1');
    expect(tokens[1].content).toBe('3.14');
    expect(tokens[2].content).toBe('-1234');
  });

  it('will parse booleans', () => {
    const tokens = tokenize('true false');

    expect(tokens.length).toBe(2);
    expect(tokens.every(token => token.type === TokenType.Boolean)).toBeTruthy();

    expect(tokens[0].content).toBe('true');
    expect(tokens[1].content).toBe('false');
  });

  it('will parse strings', () => {
    const tokens = tokenize('\"some text\"');

    expect(tokens.length).toBe(1);
    expect(tokens[0].type).toBe(TokenType.String);
  });

  it('will parse comments', () => {
    const tokens = tokenize('; hello world');

    expect(tokens.length).toBe(1);
    expect(tokens[0].type).toBe(TokenType.Comment);
  });

  it('will parse everything else as identifiers', () => {
    const tokens = tokenize('+ word !');

    expect(tokens.length).toBe(3);
    expect(tokens.every(token => token.type === TokenType.Identifier))
      .toBeTruthy();
  });

  it('will parse keywords', () => {
    const tokens = tokenize('defconstant defun defvar');

    const mapping = [
      TokenType.DefConstant,
      TokenType.DefFunction,
      TokenType.DefVariable,
    ];

    expect(tokens.length).toBe(3);

    while (mapping.length !== 0) {
      expect(tokens[0].type).toBe(mapping[0]);

      tokens.shift();
      mapping.shift();
    }
  });
});

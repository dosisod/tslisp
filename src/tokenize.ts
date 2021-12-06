/**
 * @module tokenize
 * @author Logan Hunt
 *
 * Tokens are strings of characters which have some semantic meaning, ie,
 * a number, an identifier, and so on.
 *
 * Once code has been split up into tokens, the tokens can be analyzed, and
 * a more complex representation of the program can be created.
 */

/**
 * @param str to check
 * @returns true if `str` is numeric
 */
const isNumeric = (str: string): boolean => {
  return !isNaN(parseFloat(str));
};

/**
 * Try and detect the type of the token. By default, unknown tokens are
 * identifiers, which can allow for creating interesting functions
 *
 * @param str to check
 * @returns the type of the token
 */
const detectTokenType = (str: string): TokenType => {
  if (str === '(') return TokenType.OpenParen;
  if (str === ')') return TokenType.CloseParen;
  if (str === 'true' || str === 'false') return TokenType.Boolean;
  if (str === 'defconstant') return TokenType.DefConstant;
  if (str === 'defun') return TokenType.DefFunction;
  if (str === 'defvar') return TokenType.DefVariable;
  if (isNumeric(str)) return TokenType.Number;
  if (str.startsWith('\"')) return TokenType.String;
  if (str.startsWith(';')) return TokenType.Comment;

  return TokenType.Identifier;
};

/**
 * The first part of tokenizing is spliting up the string into tokens. For
 * example, the start of a comment to the end of the line is a token, the
 * start and end of a string is a token, and semantically important
 * characters like '(' and ')'.
 *
 * @param str to "chunk"
 * @returns chunk of strings
 */
const chunkString = (str: string): string[] => {
  const chunks: string[] = [];
  let chunk = '';
  let isInString = false;
  let isInComment = false;

  for (const char of str) {
    if (char === ';') {
      isInComment = true;
    } else if (char === '\"') {
      isInString = !isInString;
    } else if (char === '\n') {
      isInComment = !isInComment;
    }

    if (isInString || isInComment) {
      chunk += char;
      continue;
    }

    if (char.match(/\s/)) {
      if (chunk) {
        chunks.push(chunk);
        chunk = '';
      }
    } else if (char === '(' || char === ')') {
      if (chunk) {
        chunks.push(chunk);
      }
      chunks.push(char);
      chunk = '';
    } else {
      chunk += char;
    }
  }

  if (chunk) chunks.push(chunk);

  return chunks;
};

/**
 * Convert string to tokens, and assign token type to each string.
 *
 * @param str to tokenize
 * @returns list of tokens
 */
const tokenize = (str: string): Token[] => chunkString(str).map(chunk => ({
  type: detectTokenType(chunk),
  content: chunk
}));

export enum TokenType {
  OpenParen,
  CloseParen,
  Number,
  Boolean,
  String,
  Comment,
  Identifier,
  DefConstant,
  DefFunction,
  DefVariable,
}

export interface Token {
  type: TokenType;
  content: string;
}

export default tokenize;

const isNumeric = (str: string): boolean => {
  return !isNaN(parseFloat(str));
};


const detectTokenType = (str: string): TokenType | null => {
  if (str === '(') return TokenType.OpenParen;
  if (str === ')') return TokenType.CloseParen;
  if (isNumeric(str)) return TokenType.Number;
  if (str === 'true' || str === 'false') return TokenType.Boolean;
  if (str.startsWith('\"')) return TokenType.String;
  if (str.startsWith(';')) return TokenType.Comment;

  return TokenType.Identifier;
};

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

const tokenize = (str: string): Token[] => {
  const tokens: Token[] = [];

  for (const chunk of chunkString(str)) {
    const tokenType = detectTokenType(chunk);

    if (tokenType !== null) {
      tokens.push({ type: tokenType, content: chunk });
    }
  }

  return tokens;
};


export enum TokenType {
  OpenParen,
  CloseParen,
  Number,
  Boolean,
  String,
  Comment,
  Identifier,
}


export interface Token {
  type: TokenType;
  content: string;
}


export default tokenize;

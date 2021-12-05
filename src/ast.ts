import { Token, TokenType } from './tokenize';

/**
@module AST
@author Logan Hunt

This module takes a stream of tokens and converts them into a meaningful,
parseable tree of nodes (an Abstract Syntax Tree). A node can be a function,
a literal (number, string, etc), if statement, etc.

Since LISP dialects use parentheses to group expressions, we turn each pair
of parentheses into an array of tokens. For example:

  (map (list 1 2 3))

turns into:

  [map, [list, 1, 2, 3]]

If the number of open/close parentheses is unbalanced (an open/closing
parenthesis is missing), an error is thrown.

After this step, we traverse are newly created "token-tree", turning each
pair into a node. For example, a token group starting with an identifier
is considered a function call.
*/


type TokenList = (Token | TokenList)[];

const bracketizeTokens = (
  tokens: Token[], lvl: number = 0, stack: TokenList = []
): [number, Token[], TokenList] => {
  while (tokens.length > 0) {
    const tok = tokens[0];

    if (tok.type === TokenType.OpenParen) {
      tokens.shift();
      const [newLvl, newTokens, newStack] = bracketizeTokens(tokens, ++lvl);

      lvl = newLvl;
      tokens = newTokens;
      stack.push(newStack);
    }
    else if (tok.type === TokenType.CloseParen) {
      return [--lvl, tokens, stack];
    }
    else if (lvl > 0) {
      stack.push(tok);
    }
    else {
      throw 'Found token outside of paranthesis';
    }

    tokens.shift();
  }

  return [lvl, [], stack];
};

const functionTokenGroupToNode = (tokens: TokenList): AstNode => {
  const name = (tokens[0] as Token).content;
  const children = tokens.slice(1);

  const childrenNodes = children.map(child => {
    if (Array.isArray(child)) {
      throw 'Nested nodes in expression not supported yet';
    }

    switch (child.type) {
      case TokenType.Number:
      case TokenType.String:
      case TokenType.Boolean:
      case TokenType.Identifier:
        return {
          type: AstNodeType.Expression,
          token: child
        };
      default:
        throw 'something happened';
    }
  });

  return {
    type: AstNodeType.Function,
    children: childrenNodes,
    name
  } as AstNodeFunction;
};

const defConstTokenGroupToNode = (tokens: TokenList): AstNode => {
  if (tokens.length !== 3) {
    throw 'defconstant node must be in form (defconstant name value)';
  }

  // TODO: handle name or value being a list, not a token
  const name = (tokens[1] as Token).content;
  const value = (tokens[2] as Token).content;

  return {
    type: AstNodeType.DefConstant,
    name,
    value
  } as AstNodeDefConstant;
};

const defVariableTokenGroupToNode = (tokens: TokenList): AstNode => {
  if (tokens.length !== 3) {
    throw 'defvar node must be in form (defvar name value)';
  }

  // TODO: handle name or value being a list, not a token
  // TODO: check that token type is an identifier
  const name = (tokens[1] as Token).content;
  const value = (tokens[2] as Token).content;

  return {
    type: AstNodeType.DefVariable,
    name,
    value
  } as AstNodeDefVariable;
};

const tokenGroupToNode = (tokenGroup: TokenList): AstNode[] => {
  const nodes: AstNode[] = [];

  tokenGroup.forEach((group) => {
    if (!Array.isArray(group)) {
      return;
    }

    const firstToken = group[0];

    if (!firstToken) {
      nodes.push({
        type: AstNodeType.Empty
      });
    }
    else if (Array.isArray(firstToken)) {
      throw 'Cannot have list as first element of list';
    }

    if (firstToken?.type === TokenType.Identifier) {
      nodes.push(functionTokenGroupToNode(group));
    }
    if (firstToken?.type === TokenType.DefConstant) {
      nodes.push(defConstTokenGroupToNode(group));
    }
    if (firstToken?.type === TokenType.DefVariable) {
      nodes.push(defVariableTokenGroupToNode(group));
    }
    if (firstToken?.type === TokenType.DefFunction) {
      nodes.push(defFunctionTokenGroupToNode(group));
    }
  });

  return nodes;
};

const defFunctionTokenGroupToNode = (tokens: TokenList): AstNode => {
  const name = (tokens[1] as Token).content;
  const params = (tokens[2] as Token[]).map(token => token.content);

  return {
    type: AstNodeType.DefFunction,
    name,
    params,
    children: tokenGroupToNode([tokens[3]])
  } as AstNodeDefFunction;
};

const tokensToAst = (tokens: Token[]): AstTree => {
 tokens = tokens.filter(token => token.type !== TokenType.Comment);

  const [lvl, _, tokenGroup] = bracketizeTokens(tokens);

  if (lvl > 0) {
    throw 'Expected closing parenthesis';
  }
  if (lvl < 0) {
    throw 'Expected opening parenthesis';
  }

  return { nodes: tokenGroupToNode(tokenGroup) };
};

export enum AstNodeType {
  Empty,
  Function,
  Declaration,
  Expression,
  DefConstant,
  DefVariable,
  DefFunction,
}

export interface AstNode {
  type: AstNodeType;
  token?: Token;
  children?: AstNode[];
}

export interface AstNodeFunction extends AstNode {
  name: string;
}

export interface AstNodeDefConstant extends AstNode {
  name: string;
  value: string;
}

export interface AstNodeDefVariable extends AstNode {
  name: string;
  value: string;
}

export interface AstNodeDefFunction extends AstNode {
  name: string;
  params: string[];
}

export interface AstTree {
  nodes: AstNode[];
}

export default tokensToAst;

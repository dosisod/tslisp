import tokenize, { TokenType } from '../src/tokenize';
import tokensToAst, { AstNodeDefConstant, AstNodeDefVariable, AstNodeFunction, AstNodeType } from '../src/ast';

describe('tokensToAst', () => {
  it('will parse basic set', () => {
    const tokens = tokenize('()');

    const tree = tokensToAst(tokens);

    expect(tree.nodes.length).toBe(1);
    expect(tree.nodes[0].type).toBe(AstNodeType.Empty);
  });

  it('will throw error if opening paren is missing', () => {
    const tokens = tokenize(')');

    expect(() => tokensToAst(tokens)).toThrow('Expected opening parenthesis');
  });

  it('will throw error if closing paren is missing', () => {
    const tokens = tokenize('(');

    expect(() => tokensToAst(tokens)).toThrow('Expected closing parenthesis');
  });

  it('will ignore comments', () => {
    const tokens = tokenize('; hello\n()');

    const tree = tokensToAst(tokens);

    expect(tree.nodes.length).toBe(1);
    expect(tree.nodes[0].type).toBe(AstNodeType.Empty);
  });

  it('will detect invalid tokens after first node', () => {
    const tokens = tokenize('()x');

    expect(() => tokensToAst(tokens)).toThrow('Found token outside of paranthesis');
  });

  it('will parse function call', () => {
    const tokens = tokenize('(f)');

    const tree = tokensToAst(tokens);

    expect(tree.nodes.length).toBe(1);
    expect(tree.nodes[0].type).toBe(AstNodeType.Function);
    expect((tree.nodes[0] as AstNodeFunction).name).toBe('f');
  });

  it('will parse function call with children', () => {
    const tokens = tokenize('(f 1 2 3)');

    const tree = tokensToAst(tokens);

    expect(tree.nodes.length).toBe(1);

    const node = tree.nodes[0];

    expect(node.type).toBe(AstNodeType.Function);
    expect(node.children).toBeTruthy();
    expect(node.children?.length).toBe(3);
    expect(node.children?.every(
      node => node.type === AstNodeType.Expression
    )).toBeTruthy();

    expect(node.children?.[0].token?.type).toBe(TokenType.Number);
  });

  it('will fail if trying to use nested list in function', () => {
    const tokens = tokenize('(f (x))');

    expect(() => tokensToAst(tokens))
      .toThrow('Nested nodes in expression not supported yet');
  });

  it('will not allow list as first element of list', () => {
    const tokens = tokenize('(())');

    expect(() => tokensToAst(tokens))
      .toThrow('Cannot have list as first element of list');
  });

  it('will check for length of defconstant node', () => {
    const tokens = tokenize('(defconstant)');

    expect(() => tokensToAst(tokens))
      .toThrow('defconstant node must be in form (defconstant name value)');
  });

  it('will parse defconstant nodes', () => {
    const tokens = tokenize('(defconstant pi 3.14)');

    const tree = tokensToAst(tokens);

    expect(tree.nodes.length).toBe(1);

    const node = (tree.nodes[0] as AstNodeDefConstant);

    expect(node.type).toBe(AstNodeType.DefConstant);
    expect(node.name).toBe('pi');
    expect(node.value).toBe('3.14');
  });

  it('will check for length of defvar node', () => {
    const tokens = tokenize('(defvar)');

    expect(() => tokensToAst(tokens))
      .toThrow('defvar node must be in form (defvar name value)');
  });

  it('will parse defvar nodes', () => {
    const tokens = tokenize('(defvar pi 3.14)');

    const tree = tokensToAst(tokens);

    expect(tree.nodes.length).toBe(1);

    const node = (tree.nodes[0] as AstNodeDefVariable);

    expect(node.type).toBe(AstNodeType.DefVariable);
    expect(node.name).toBe('pi');
    expect(node.value).toBe('3.14');
  });
});

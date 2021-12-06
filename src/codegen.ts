import { AstNode, AstNodeDefConstant, AstNodeDefFunction, AstNodeDefVariable, AstNodeFunction, AstNodeType, AstTree } from "./ast";

/**
 * @module codegen
 * @author Logan Hunt
 *
 * After a tree-like representation of a program has been created, it is time
 * to turn it into executable code. In this case it is being converted to
 * JavaScript. As we walk through the tree, we convert each node to it's
 * JavaScript equivalent. For example:
 *
 *   (console.log "hello world")
 *
 * turns into:
 *
 *   console.log("hello world")
 */

/**
 * binary operators are operators that have 2 operands.
 * This map will map the TSLisp version to the TypeScript version.
 */
const binaryOperMap: { [oper: string]: string } = {
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
  '=': '===',
  '!=': '!==',
  'or': '||',
  'and': '&&',
  'xor': '^',
  'mod': '%',
  '<': '<',
  '<=': '<=',
  '>': '>',
  '>=': '>=',
  'exp': '**',
  'rshift': '<<',
  'lshift': '>>'
};

/**
 * unary operators are operators that take one operand. This also maps the
 * TSLisp version to the TypeScript equivalent.
 */
const unaryOperMap: { [oper: string]: string } = {
  'not': '!',
  'neg': '-'
};

/**
 * Since binary operators are not functions in TypeScript, we need to convert
 * the function call into a binary expression that TypeScript can understand.
 * This function returns an empty string if `name` is not a binary operator.
 *
 * @param name of the operator
 * @param params that the operator takes
 * @returns TypeScript stringified version of the operator
 */
const handleBinaryExpr = (name: string, params: string[]): string => {
  if (!(name in binaryOperMap)) return '';

  // TODO: properly handle chainable expressions
  const oper = binaryOperMap[name];
  const expr = params.join(` ${oper} `);

  return `(${expr})`;
};

/**
 * Same as `handleBinaryExpr`, but for unary operators.
 *
 * @param name of the operator
 * @param params that the operator takes
 * @returns TypeScript stringified version of the operator
 */
const handleUnaryExpr = (name: string, params: string[]): string => {
  if (!(name in unaryOperMap)) return '';

  // TODO: disallow N > 1 params for unary expression
  const oper = unaryOperMap[name];
  const firstToken = params[0];

  return oper + firstToken;
};

/**
 * Same as `handleBinaryExpr`, but for list operations.
 *
 * @param name of the list function
 * @param params for said list function
 * @returns TypeScript stringified version of the list operation
 */
const handleListExpr = (name: string, params: string[]): string => {
  switch(name) {
    case 'list': return `[${params.join(", ")}]`;
    case 'filter':
    case 'map':
    case 'some':
    case 'every':
    case 'includes':
      return `${params[1]}.${name}(${params[0]})`;
    default: return '';
  }
};

/**
 * Handle other function conversions, like using "(exit)" to close out of
 * the REPL
 *
 * @param name of the function
 * @param params of the function
 * @returns TypeScript stringified version of the function
 */
const handleMiscExpr = (name: string, params: string[]): string => {
  switch (name) {
    case 'exit': return 'process.exit(0)';
    case 'set': return `global.${params[0]} = ${params[1]}`;
    default: return '';
  }
};

/**
 * @param name of the function
 * @param params of the function
 * @returns TypeScript stringified version of the function
 */
const handleFunctionExpr = (name: string, params: string[]): string => (
  `${name}(${params.join(", ")})`
);

/**
 * Convert a function node into it's corresponding TypeScript representation
 *
 * @param node to convert
 * @returns the TypeScript version of said node
 */
const astFunctionToJs = (node: AstNodeFunction): string => {
  const name = node.name;

  // convert parameter list into expression list
  const params = node.children?.map(astNodeToJS) || [];

  return (
    handleBinaryExpr(name, params) ||
    handleUnaryExpr(name, params) ||
    handleListExpr(name, params) ||
    handleMiscExpr(name, params) ||
    handleFunctionExpr(name, params)
  );
};

/**
 * Creates a new constant. Note: due to limitations of `eval`, we cannot use
 * an actual "const" value, since it will not be able to be accessed at
 * runtime.
 *
 * @param node
 * @returns TypeScript code to create new constant
 */
const astDefConstantToJs = (node: AstNodeDefConstant): string => {
  return `global.${node.name} = ${node.value}`;
};

/**
 * Creates a new variable.
 *
 * @param node
 * @returns TypeScript code to create new variable
 */
const astDefVariableToJs = (node: AstNodeDefVariable): string => {
  return `global.${node.name} = ${node.value}`;
};

/**
 * Creates a new function.
 *
 * @param node
 * @returns TypeScript code to declare a new function
 */
const astDefFunctionToJs = (node: AstNodeDefFunction): string => {
  const body = node.children!
    .map(child => `(${astNodeToJS(child)})`)
    .join(', ');

  return `global.${node.name} = (${node.params.join(", ")}) => (${body});`;
};

/**
 * @param node to convert to TypeScript expression
 * @returns TypeScript expression
 */
const astNodeToJS = (node: AstNode): string => {
  switch (node.type) {
    case AstNodeType.Function:
      return astFunctionToJs(node as AstNodeFunction);
    case AstNodeType.DefConstant:
      return astDefConstantToJs(node as AstNodeDefConstant);
    case AstNodeType.DefVariable:
      return astDefVariableToJs(node as AstNodeDefVariable);
    case AstNodeType.DefFunction:
      return astDefFunctionToJs(node as AstNodeDefFunction);
    default:
      return node.token?.content || '';
  }
};

/**
 * Stringifies tree of AST nodes
 *
 * @param tree
 * @returns stringified version of `tree`.
 */
export const astToJS = (tree: AstTree): string => {
  return astNodeToJS(tree.nodes[0]);
};

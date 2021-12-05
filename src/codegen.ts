import { AstNodeDefConstant, AstNodeDefFunction, AstNodeDefVariable, AstNodeFunction, AstNodeType, AstTree } from "./ast";

/**
@module codegen
@author Logan Hunt

After a tree-like representation of a program has been created, it is time
to turn it into executable code, in this case it is being converted to
JavaScript. As we walk through the tree, we convert each node to it's
JavaScript equivalent. For example:

  (defconst x 1)

turns into:

  const x = 1;
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

const unaryOperMap: { [oper: string]: string } = {
  'not': '!',
  'neg': '-'
};

const handleBinaryExpr = (name: string, params: string[]): string => {
  if (!(name in binaryOperMap)) return '';

  // TODO: properly handle chainable expressions
  const oper = binaryOperMap[name];
  const expr = params.join(` ${oper} `);

  return `(${expr})`;
};

const handleUnaryExpr = (name: string, params: string[]): string => {
  if (!(name in unaryOperMap)) return '';

  // TODO: disallow N > 1 params for unary expression
  const oper = unaryOperMap[name];
  const firstToken = params[0];

  return oper + firstToken;
};

const handleListExpr = (name: string, params: string[]): string => (
  name === 'list' ?
    `[${params.join(", ")}]` :
    ''
);

const handleFunctionExpr = (name: string, params: string[]): string => (
  `${name}(${params.join(", ")});`
);

const astFunctionToJs = (node: AstNodeFunction): string => {
  const name = node.name;

  const params = node.children?.map(node => {
    return node.token?.content || '';
  }) || [];

  return (
    handleBinaryExpr(name, params) ||
    handleUnaryExpr(name, params) ||
    handleListExpr(name, params) ||
    handleFunctionExpr(name, params)
  );
};

const astDefConstantToJs = (node: AstNodeDefConstant): string => {
  return `const ${node.name} = ${node.value};`;
};

const astDefVariableToJs = (node: AstNodeDefVariable): string => {
  return `let ${node.name} = ${node.value};`;
};

const astDefFunctionToJs = (node: AstNodeDefFunction): string => {
  const body = astToJS({ nodes: node.children! });

  return `const ${node.name} = (${node.params.join(", ")}) => { ${body} };`;
};

export const astToJS = (tree: AstTree): string => {
  switch (tree.nodes[0].type) {
    case AstNodeType.Function:
      return astFunctionToJs(tree.nodes[0] as AstNodeFunction);
    case AstNodeType.DefConstant:
      return astDefConstantToJs(tree.nodes[0] as AstNodeDefConstant);
    case AstNodeType.DefVariable:
      return astDefVariableToJs(tree.nodes[0] as AstNodeDefVariable);
    case AstNodeType.DefFunction:
      return astDefFunctionToJs(tree.nodes[0] as AstNodeDefFunction);
    default: return '';
  }
};

import { AstNodeDefConstant, AstNodeDefFunction, AstNodeDefVariable, AstNodeFunction, AstNodeType, AstTree } from "./ast";

const astFunctionToJs = (node: AstNodeFunction): string => {
  const params = node.children?.map(node => {
    return node.token?.content;
  });

  return `${node.name}(${params?.join(", ")});`;
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

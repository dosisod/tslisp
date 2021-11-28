import { AstNodeFunction, AstTree } from "./ast";

export const astToJS = (tree: AstTree): string => {
  const name = (tree.nodes[0] as AstNodeFunction).name;

  const params = tree.nodes[0].children?.map(node => {
    return node.token?.content;
  });

  return `${name}(${params?.join(", ")});`;
}
import { ASTNode } from "../interfaces/AST";

export interface IVisitProps {
  parent?: any;
  prop?: string;
  id?: number;
  context?: IASTContext;
}
export interface IASTContext {
  userContext?: any;
  locals?: Array<string>;
}

export interface IASTVisitor {
  node: any;
  props: IVisitProps;
  context?: IASTContext;
}

export interface IVisit {
  node: ASTNode;
  parent?: ASTNode;
  property?: string;
  id?: number;
  context?: IASTContext;
}

export interface IVisitorMod {
  context?: IASTContext;
  replaceWith?: ASTNode | Array<ASTNode>;
  removeNode: boolean;
}

function astTransformer() {
  let replaces: Array<{ target: IVisit; nodes: Array<ASTNode> }>;
  let removes: Array<{ target: IVisit }>;
  return {
    replaceLater: (target: IVisit, nodes: Array<ASTNode>) => {
      if (!replaces) replaces = [];
      replaces.push({ target, nodes });
    },
    removeLater: (target: IVisit) => {
      if (!removes) removes = [];
      removes.push({ target });
    },
    finalise: () => {
      if (replaces) {
        for (const item of replaces) {
          const visitor = item.target;
          if (visitor.property && visitor.parent) {
            if (visitor.parent[visitor.property] instanceof Array) {
              const index = visitor.parent[visitor.property].indexOf(
                visitor.node
              );
              if (index > -1) {
                visitor.parent[visitor.property].splice(
                  index,
                  1,
                  ...item.nodes
                );
              }
            } else {
              visitor.parent[visitor.property] = item.nodes[0];
            }
          }
        }
      }
      if (removes) {
        for (const item of removes) {
          const visitor = item.target;
          if (visitor.property && visitor.parent) {
            if (visitor.parent[visitor.property] instanceof Array) {
              const index = visitor.parent[visitor.property].indexOf(
                visitor.node
              );
              if (index > -1) {
                visitor.parent[visitor.property].splice(index, 1);
              }
            }
          }
        }
      }
    }
  };
}

function _visit(
  t,
  fn: (visit: IVisit) => IVisitorMod | void,
  node: ASTNode,
  props: { parent?; property?; id?: number },
  context: IASTContext
) {
  const visit = {
    context,
    node,
    parent: props.parent,
    property: props.property,
    id: props.id
  };
  const response = fn(visit);
  if (response) {
    if (response.removeNode) {
      t.removeLater(visit);
    } else if (response.replaceWith) {
      let replacedNodes = [].concat(response.replaceWith);
      t.replaceLater(visit, replacedNodes);
      // we need walk through them right after replacing and ignore the old nodes
      for (const n of replacedNodes) {
        _visit(
          t,
          fn,
          n,
          { parent: props.parent, property: props.property },
          context
        );
      }
      return;
    }
  }

  for (const property in node) {
    if (property[0] === "$") {
      continue;
    }
    const child = node[property];
    if (child instanceof Array) {
      for (let i = 0; i < child.length; i++) {
        if (child && child[i] && child[i].type) {
          _visit(t, fn, child[i], { parent: node, property, id: i }, context);
        }
      }
    } else {
      if (child && child.type)
        _visit(t, fn, child, { parent: node, property }, context);
    }
  }
}

export function FastVisit(
  ast: ASTNode,
  fn: (visit: IVisit) => IVisitorMod | any
): ASTNode {
  const transformer = astTransformer();
  _visit(transformer, fn, ast, {}, undefined);
  transformer.finalise();
  return ast;
}

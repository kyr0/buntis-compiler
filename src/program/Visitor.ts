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

class TransformationContext {
  private _replaces: Array<{ target: IVisit; nodes: Array<ASTNode> }>;
  private _remove: Array<{ target: IVisit }>;
  constructor(public root: ASTNode) {}

  replaceLater(target: IVisit, nodes: Array<ASTNode>) {
    if (!this._replaces) this._replaces = [];
    this._replaces.push({ target, nodes });
  }

  removeLater(target: IVisit) {
    if (!this._remove) this._remove = [];

    this._remove.push({ target });
  }

  private replaceNodes() {
    for (const item of this._replaces) {
      const visitor = item.target;
      if (visitor.property && visitor.parent) {
        if (visitor.parent[visitor.property] instanceof Array) {
          const index = visitor.parent[visitor.property].indexOf(visitor.node);
          if (index > -1) {
            visitor.parent[visitor.property].splice(index, 1, ...item.nodes);
          }
        } else {
          visitor.parent[visitor.property] = item.nodes[0];
        }
      }
    }
  }

  private removeNodes() {
    for (const item of this._remove) {
      const visitor = item.target;
      if (visitor.property && visitor.parent) {
        if (visitor.parent[visitor.property] instanceof Array) {
          const index = visitor.parent[visitor.property].indexOf(visitor.node);
          if (index > -1) {
            visitor.parent[visitor.property].splice(index, 1);
          }
        }
      }
    }
  }

  finalise() {
    if (this._remove) this.removeNodes();
    if (this._replaces) this.replaceNodes();
  }
}
function _visit(
  t: TransformationContext,
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
  const t = new TransformationContext(ast);
  _visit(t, fn, ast, {}, undefined);
  t.finalise();
  return ast;
}

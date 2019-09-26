import { ASTNode } from "../interfaces/AST";
import { ITransformer, transpileModule } from "../program/transpileModule";
import { IVisit, IVisitorMod } from "../Visitor/Visitor";
import { GlobalContext, createGlobalContext } from "../program/GlobalContext";

export function NamespaceTransformer(): ITransformer {
  return {
    onEachNode: (visit: IVisit) => {
      if (visit.node.type === "ModuleDeclaration") {
        return { ignoreChildren: true };
      }
    },
    onTopLevelTraverse: (visit: IVisit): IVisitorMod => {
      const node = visit.node;
      const globalContext = visit.globalContext as GlobalContext;

      if (node.type === "ModuleDeclaration") {
        const nm = node.body as ASTNode;
        // launch custom transpilation for that namespace
        // we skip children in onEachNode
        transpileModule({
          ...globalContext.programProps,
          ast: nm,
          namespace: node.id.name,
          globalContext: createGlobalContext({})
        });

        //node.body.context =
        const Declaration: ASTNode = {
          type: "VariableDeclaration",
          kind: "var",
          declarations: [
            {
              type: "VariableDeclarator",
              init: null,
              id: {
                type: "Identifier",
                name: node.id.name
              }
            }
          ]
        };

        const FunctionBody: ASTNode = {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "FunctionExpression",
              params: [
                {
                  type: "Identifier",
                  name: "Validation"
                }
              ],
              body: {
                type: "BlockStatement",
                body: (node.body as ASTNode).body
              },
              async: false,
              generator: false,
              id: null
            },
            arguments: [
              {
                type: "LogicalExpression",
                left: {
                  type: "Identifier",
                  name: "Validation"
                },
                right: {
                  type: "AssignmentExpression",
                  left: {
                    type: "Identifier",
                    name: "Validation"
                  },
                  operator: "=",
                  right: {
                    type: "ObjectExpression",
                    properties: []
                  }
                },
                operator: "||"
              }
            ]
          }
        };
        // replace it with a new node
        return {
          replaceWith: [Declaration, FunctionBody]
        };
      }
    }
  };
}

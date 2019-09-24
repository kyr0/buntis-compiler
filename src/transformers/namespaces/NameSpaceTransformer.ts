import { ASTNode } from "../../interfaces/AST";
import { createNodeContext } from "../../program/NodeContext";
import { IVisit } from "../../program/Visitor";


export function NamespaceTransformer(globalContext) {
  return (visit: IVisit) => {
    const node = visit.node;

    if (node.type === "ModuleDeclaration") {
      const nodeContext = createNodeContext();

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
              name: nodeContext.namespace
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
  };
}

import { IVisit, IVisitorMod } from "../program/Visitor";

export function ExportTransformer(globalContext) {
  return (visit: IVisit): IVisitorMod => {
    const node = visit.node;
    // remove export interface
    // export interface HelloWorld{}
    if (node.type === "ExportNamedDeclaration") {
      if (
        node.declaration &&
        node.declaration.type === "InterfaceDeclaration"
      ) {
        return { removeNode: true };
      }
    }
  };
}

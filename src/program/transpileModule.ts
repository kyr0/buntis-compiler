import { ASTNode } from "../interfaces/AST";
import { ICompilerOptions } from "../interfaces/ICompilerOptions";
import { FastVisit, IVisit, IVisitorMod } from "./Visitor";

export interface IProgramProps {
  ast: ASTNode;
  globalContext?: any;
  transformers: Array<(globalContext) => (visit: IVisit) => IVisitorMod>;
  compilerOptions?: ICompilerOptions;
}

export function transpileModule(props: IProgramProps) {
  for (const transformer of props.transformers) {
    transformer(props.globalContext);
  }

  const transformers = props.transformers.map(fn => fn(props.globalContext));
  FastVisit(props.ast, visit => {
    for (const transformer of transformers) {
      let response = transformer(visit);
      if (response) return response;
    }
  });
}

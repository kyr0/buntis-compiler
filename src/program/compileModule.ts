import { transpileModule } from "./transpileModule";
import { IVisit, IVisitorMod } from "./Visitor";
import { ICompilerOptions } from "../interfaces/ICompilerOptions";
import * as buntis from "buntis";
import { ASTNode } from "../interfaces/AST";
import { NamespaceTransformer } from "../transformers/namespaces/NameSpaceTransformer";
import { ExportTransformer } from "../transformers/ExportTransformer";
import { generate } from "../generator/generator";

export interface ICompileModuleProps {
  code: string;
  globalContext?: any;
  transformers?: Array<(globalContext) => (visit: IVisit) => IVisitorMod>;
  compilerOptions?: ICompilerOptions;
}

export function compileModule(props: ICompileModuleProps) {
  const ast = buntis.parseTSModule(props.code, {
    directives: true,
    jsx: true,
    next: true,
    loc: true,
    ts: true
  });

  const defaultTransformers = [NamespaceTransformer, ExportTransformer];

  transpileModule({
    ast: ast as ASTNode,
    compilerOptions: props.compilerOptions,
    globalContext: props.globalContext,
    transformers: defaultTransformers
  });

  const res = generate(ast, {});

  return { code: res };
}

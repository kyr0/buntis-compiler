import * as buntis from "buntis";
import { ITranspilerOptions } from "./interfaces/ITranspilerOptions";
import { createProgram } from "./program/transpileModule";


export function transpile(props?: ITranspilerOptions) {
  const response: any = buntis.parseTSModule(props.code, {
    // The flag to enable stage 3 support (ESNext)
    next: true,

    // The flag to enable line/column location information to each node
    loc: true,

    // Enabled directives
    directives: true,

    // The flag to enable implied strict mode
    impliedStrict: true,

    // Enable React JSX parsing
    jsx: true,

    // Enable Typescript parsing
    ts: true

    // Allow edge cases that deviate from the spec
    //specDeviation: true
  });

  createProgram({ ast: response, opts: props });
}



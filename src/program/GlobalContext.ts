import { ASTNode } from "../interfaces/AST";
import { IProgramProps } from "./transpileModule";

export interface GlobalContext {
  getNextIndex: () => number;
  exportAfterDeclaration?: {
    [key: string]: {
      target?: string;
    };
  };
  programProps?: IProgramProps;
  identifierReplacement: {
    [key: string]: {
      first?: string;
      second?: string;
      insertAfter?: ASTNode;
    };
  };
}

export function createGlobalContext(userContext): GlobalContext {
  let index = 1;
  return {
    getNextIndex: () => index++,
    identifierReplacement: {}
  };
}

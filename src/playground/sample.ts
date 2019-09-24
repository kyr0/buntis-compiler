console.log(1);
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  export class SomeThing {
    private foo() {}
  }
}

new Validation.SomeThing();

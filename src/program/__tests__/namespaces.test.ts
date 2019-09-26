import { compileModule } from "../compileModule";

describe("Namespaces", () => {
  it("should compile namespace", () => {
    const result = compileModule({
      code: `
      import foo from "./bar";
      namespace Foo {
        export const a = 1;
        export function hello(){
            console.log(a, foo)
        }
        console.log(a);
      }
      console.log(a, hello)
        `
    });
    console.log(result.code);
  });
});

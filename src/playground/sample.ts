import foo from "./bar";
namespace Foo {
  export const a = 1;
  export function hello() {
    console.log(a);
  }
  console.log(foo);
}
console.log(a);

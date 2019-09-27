import { compileModule } from "../compileModule";

describe("JSX", () => {
  it("should parse simple jsx", () => {
    const result = compileModule({
      code: `
        function test(){
            return <div></div>
        }
          `
    });
    expect(result.code).toMatchInlineSnapshot(`
      "function test() {
        return React.createElement(\\"div\\", null);
      }
      "
    `);
  });

  it("should add text", () => {
    const result = compileModule({
      code: `
        function test(){
            return <div>1</div>
        }
          `
    });
    expect(result.code).toMatchInlineSnapshot(`
      "function test() {
        return React.createElement(\\"div\\", null, \\"1\\");
      }
      "
    `);
  });

  it.only("should add just attributes", () => {
    const result = compileModule({
      code: `
        import oi from "./oi";
        function test(){
          return (<i id="1" f={oi} ></i>)
        }
          `
    });
    console.log(result.code);
    // expect(result.code).toMatchInlineSnapshot(`
    //   "function test() {
    //     return React.createElement(\\"div\\", null, \\"1\\");
    //   }
    //   "
    // `);
  });
});

import { IBumpVersionType } from "fuse-box/sparky/bumpVersion";
import { sparky } from "fuse-box/sparky/sparky";
import { tsc } from "fuse-box/sparky/tsc";

class Context {
  npmTag: "latest" | "alpha" | "next";
  versionBumpType: IBumpVersionType;
}
const { src, rm, task, exec } = sparky(Context);

function runTypeChecker() {
  const typeChecker = require("fuse-box-typechecker").TypeChecker({
    tsConfig: "./src/tsconfig.json",
    basePath: "./",
    name: "typecheck",
    throwOnSyntactic: true,
    throwOnSemantic: true,
    throwOnGlobal: true
  });
  // to run it right away
  typeChecker.printSettings();

  return typeChecker.inspectAndPrint();
}
task("transpile", async c => {
  await tsc(
    {
      declaration: true,
      module: "CommonJS",
      skipLibCheck: true,
      target: "ES2017",
      outDir: "dist"
    },
    "src/index.ts"
  );
});

task("clean", async () => {
  await rm("dist");
});

task("typecheck", () => {
  runTypeChecker();
});

// bump version to automate
task("bump-version", async ctx => {
  await src("package.json")
    .bumpVersion("package.json", { type: "next" })
    .write()
    .dest("dist/", __dirname)
    .exec();
});

// task("publish", async ctx => {
//   await exec("dist");
//   await npmPublish({ path: "dist/", tag: "next" });
// });

task("publish-next", async ctx => {
  await exec("publish");
});

task("dist", async ctx => {
  await exec("clean");
  await exec("typecheck");
  await exec("transpile");
  //await exec("bump-version");
});

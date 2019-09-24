process.env.JEST_TEST = true;
module.exports = {
  globals: {
    "ts-jest": {
      diagnostics: false,
      tsConfig: "src/tsconfig.json"
    }
  },
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },

  testRegex: "(/(__tests__|tests)/.*|(\\.|/))\\.test\\.tsx?$",
  testPathIgnorePatterns: [
    ".fusebox/",
    "/lib/",
    "node_modules/",
    "modules",
    "_playground/",
    "dist/",
    ".dev/"
  ],
  maxConcurrency: 1,
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "json"],
  coveragePathIgnorePatterns: [
    "test_utils.ts",
    "logging/logging.ts",
    "logging/spinner.ts"
  ]
};

import js from "@eslint/js";

export default [
  {
    // Global ignores — must be a standalone config object
    ignores: [
      "**/*.ts",
      "**/*.tsx",
      "node_modules/",
      "dist/",
      ".output/",
      ".vinxi/",
      ".content-collections/",
      ".contentlayer/",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "off",
    },
  },
];

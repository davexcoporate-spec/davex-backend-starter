const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  {
    ignores: ["dist", "node_modules"],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      // Acceptable dans les squelettes de modules (Sem.2+ les remplaceront)
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  }
);

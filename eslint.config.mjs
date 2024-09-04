import globals from "globals";
import pluginJs from "@eslint/js";
// noinspection NpmUsedModulesInstalled @eslint/eslintrc is installed as part of dependencies for eslint
import { FlatCompat } from "@eslint/eslintrc";
import tsESLint from "typescript-eslint";
import eslintNextConfig from "eslint-config-neon/src/next.js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const compat = new FlatCompat();

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tsESLint.configs.recommended,
  eslintNextConfig.flat[0],
  eslintPluginPrettierRecommended,
  {
    ignores: ["**/dist/*"],
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          tabWidth: 2,
        },
      ],
      indent: "off", // Turning this off to avoid conflicts with prettier
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      "no-empty-function": "off",
      "@typescript-eslint/no-empty-function": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
    settings: {
      next: {
        rootDir: "src",
      },
      react: {
        version: "detect",
      },
    },
  },
];

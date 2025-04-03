import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jestDom from "eslint-plugin-jest-dom";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  { ignores: ["dist"] },
  {
    ...jestDom.configs["flat/recommended"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.vitest,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      js,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    extends: ["js/recommended"],
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs["recommended-latest"].rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  eslintConfigPrettier,
]);

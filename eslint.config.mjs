import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettierReccommended from "eslint-plugin-prettier/recommended";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  eslintPluginPrettierReccommended,
  eslintConfigPrettier
];

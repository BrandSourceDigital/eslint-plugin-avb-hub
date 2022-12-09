import { ESLintUtils } from "@typescript-eslint/utils";

export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/BrandSourceDigital/eslint-plugin-avb-hub/blob/main/docs/rules/${name}.md`
);

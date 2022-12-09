import { ESLintUtils } from "@typescript-eslint/utils";

export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://example.com/we-have-not-set-up-docs-for-this/this-url-is-a-placeholder/rule/${encodeURIComponent(
      name
    )}`
);

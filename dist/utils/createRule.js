"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRule = void 0;
const utils_1 = require("@typescript-eslint/utils");
exports.createRule = utils_1.ESLintUtils.RuleCreator((name) => `https://example.com/we-have-not-set-up-docs-for-this/this-url-is-a-placeholder/rule/${encodeURIComponent(name)}`);
//# sourceMappingURL=createRule.js.map
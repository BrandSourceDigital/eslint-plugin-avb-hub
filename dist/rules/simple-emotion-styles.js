"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleEmotionStyles = void 0;
const utils_1 = require("@typescript-eslint/utils");
const createRule_1 = require("../utils/createRule");
function hasNonComputedName(element) {
    return element.type !== utils_1.AST_NODE_TYPES.SpreadElement && !element.computed;
}
function allHaveNonComputedNames(elements) {
    return !elements.some((e) => !hasNonComputedName(e));
}
function noPropertyConflicts(as, bs) {
    if (!allHaveNonComputedNames(as) || !allHaveNonComputedNames(bs)) {
        return false;
    }
    return !as.some((a) => bs.some((b) => (a.key.type === utils_1.AST_NODE_TYPES.Literal ? a.key.value : a.key.name) ===
        (b.key.type === utils_1.AST_NODE_TYPES.Literal ? b.key.value : b.key.name)));
}
function getCommaAfter(sourceCode, node) {
    const token = sourceCode.getTokenAfter(node, {
        filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator,
    });
    if (token && token.value === ",") {
        return token;
    }
    else {
        return null;
    }
}
function getTrailingComma(sourceCode, elements, closer) {
    var _a;
    const lastElement = (_a = elements[elements.length - 1]) !== null && _a !== void 0 ? _a : null;
    return lastElement && closer
        ? sourceCode.getFirstTokenBetween(lastElement, closer, {
            filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator && token.value === ",",
        })
        : null;
}
exports.simpleEmotionStyles = (0, createRule_1.createRule)({
    name: "simple-emotion-styles",
    meta: {
        docs: {
            description: "Function declaration names should start with an upper-case letter.",
            recommended: "warn",
        },
        type: "suggestion",
        fixable: "code",
        schema: [],
        messages: {
            removeEmptyCssAttribute: "This css prop is empty and can be removed.",
            replaceCssCallWithArray: "Use arrays instead of the css function in css props.",
            flattenArray: "This array can be flattened.",
            flattenCssCall: "This css call can be flattened.",
            removeEmptyObjectFromCssList: "This object is empty and can be removed.",
            combineAdjacentObjects: "These objects can be combined into one.",
        },
    },
    defaultOptions: [],
    create(context) {
        function removeEmptyCssAttribute(node) {
            context.report({
                messageId: "removeEmptyCssAttribute",
                node,
                fix: (fixer) => fixer.remove(node),
            });
        }
        function replaceCssCallWithArray(node) {
            context.report({
                messageId: "replaceCssCallWithArray",
                node,
                fix: function* (fixer) {
                    const sourceCode = context.getSourceCode();
                    yield fixer.remove(node.callee);
                    const openParen = sourceCode.getTokenAfter(node.callee, {
                        filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator && token.value === "(",
                    });
                    if (openParen)
                        yield fixer.replaceText(openParen, "[");
                    const closeParen = sourceCode.getLastToken(node, {
                        filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator && token.value === ")",
                    });
                    if (closeParen)
                        yield fixer.replaceText(closeParen, "]");
                },
            });
        }
        function flattenArray(node) {
            context.report({
                messageId: "flattenArray",
                node,
                fix: function* (fixer) {
                    const sourceCode = context.getSourceCode();
                    const openBracket = sourceCode.getFirstToken(node, {
                        filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator && token.value === "[",
                    });
                    if (openBracket)
                        yield fixer.remove(openBracket);
                    const closeBracket = sourceCode.getLastToken(node, {
                        filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator && token.value === "]",
                    });
                    if (closeBracket)
                        yield fixer.remove(closeBracket);
                    if (node.elements.length === 0) {
                        const commaAfter = getCommaAfter(sourceCode, node);
                        if (commaAfter)
                            yield fixer.remove(commaAfter);
                    }
                    else {
                        const trailingComma = getTrailingComma(sourceCode, node.elements, closeBracket);
                        if (trailingComma)
                            yield fixer.remove(trailingComma);
                    }
                },
            });
        }
        function flattenCssCall(node) {
            context.report({
                messageId: "flattenCssCall",
                node,
                fix: function* (fixer) {
                    const sourceCode = context.getSourceCode();
                    yield fixer.remove(node.callee);
                    const openParen = sourceCode.getTokenAfter(node.callee, {
                        filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator && token.value === "(",
                    });
                    if (openParen)
                        yield fixer.remove(openParen);
                    const closeParen = sourceCode.getLastToken(node, {
                        filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator && token.value === ")",
                    });
                    if (closeParen)
                        yield fixer.remove(closeParen);
                    if (node.arguments.length === 0) {
                        const commaAfter = getCommaAfter(sourceCode, node);
                        if (commaAfter)
                            yield fixer.remove(commaAfter);
                    }
                    else {
                        const trailingComma = getTrailingComma(sourceCode, node.arguments, closeParen);
                        if (trailingComma)
                            yield fixer.remove(trailingComma);
                    }
                },
            });
        }
        function removeEmptyObjectFromCssList(node) {
            context.report({
                messageId: "removeEmptyObjectFromCssList",
                node,
                fix: function* (fixer) {
                    const sourceCode = context.getSourceCode();
                    const openBrace = sourceCode.getFirstToken(node, {
                        filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator && token.value === "{",
                    });
                    if (openBrace)
                        yield fixer.remove(openBrace);
                    const closeBrace = sourceCode.getLastToken(node, {
                        filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator && token.value === "}",
                    });
                    if (closeBrace)
                        yield fixer.remove(closeBrace);
                    const commaAfter = getCommaAfter(sourceCode, node);
                    if (commaAfter)
                        yield fixer.remove(commaAfter);
                },
            });
        }
        function combineAdjacentObjects(node, nextNode) {
            context.report({
                messageId: "combineAdjacentObjects",
                loc: {
                    start: node.loc.start,
                    end: nextNode.loc.end,
                },
                fix: function* (fixer) {
                    const sourceCode = context.getSourceCode();
                    const closeBrace = sourceCode.getLastToken(node, {
                        filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator && token.value === "}",
                    });
                    if (closeBrace)
                        yield fixer.remove(closeBrace);
                    const trailingComma = getTrailingComma(sourceCode, node.properties, closeBrace);
                    if (trailingComma)
                        yield fixer.remove(trailingComma);
                    const openBrace = sourceCode.getFirstToken(nextNode, {
                        filter: (token) => token.type === utils_1.AST_TOKEN_TYPES.Punctuator && token.value === "{",
                    });
                    if (openBrace)
                        yield fixer.remove(openBrace);
                },
            });
        }
        function simplifyCssListLike(nodes) {
            var _a;
            let skipNextNode = false;
            for (const [i, node] of nodes.entries()) {
                if (skipNextNode) {
                    skipNextNode = false;
                    continue;
                }
                const nextNode = (_a = nodes[i + 1]) !== null && _a !== void 0 ? _a : null;
                if (node.type === utils_1.AST_NODE_TYPES.ArrayExpression) {
                    flattenArray(node);
                }
                else if (node.type === utils_1.AST_NODE_TYPES.CallExpression) {
                    if (node.callee.type === utils_1.AST_NODE_TYPES.Identifier &&
                        node.callee.name === "css") {
                        flattenCssCall(node);
                    }
                }
                else if (node.type === utils_1.AST_NODE_TYPES.ObjectExpression) {
                    if (node.properties.length === 0) {
                        removeEmptyObjectFromCssList(node);
                    }
                    else if (nextNode &&
                        nextNode.type === utils_1.AST_NODE_TYPES.ObjectExpression &&
                        noPropertyConflicts(node.properties, nextNode.properties)) {
                        combineAdjacentObjects(node, nextNode);
                        // Skip the next node because we are already doing something with it.
                        skipNextNode = true;
                    }
                    else {
                        // TODO: Simplify nested selector styles.
                    }
                }
                else {
                    // TODO: Simplify styles in ConditionalExpression.
                    // TODO: Change `condition && style` to `condition ? style : null`.
                }
            }
        }
        return {
            JSXAttribute: (node) => {
                var _a;
                if (!(node.name.type === utils_1.AST_NODE_TYPES.JSXIdentifier &&
                    node.name.name === "css" &&
                    ((_a = node.value) === null || _a === void 0 ? void 0 : _a.type) === utils_1.AST_NODE_TYPES.JSXExpressionContainer)) {
                    return;
                }
                const cssValue = node.value.expression;
                if (cssValue.type === utils_1.AST_NODE_TYPES.JSXEmptyExpression) {
                    removeEmptyCssAttribute(node);
                }
                else if (cssValue.type === utils_1.AST_NODE_TYPES.ArrayExpression) {
                    if (cssValue.elements.length === 0) {
                        removeEmptyCssAttribute(node);
                    }
                    else if (cssValue.elements.length === 1) {
                        flattenArray(cssValue);
                    }
                    else {
                        simplifyCssListLike(cssValue.elements);
                    }
                }
                else if (cssValue.type === utils_1.AST_NODE_TYPES.CallExpression) {
                    if (cssValue.callee.type === utils_1.AST_NODE_TYPES.Identifier &&
                        cssValue.callee.name === "css") {
                        if (cssValue.arguments.length === 0) {
                            removeEmptyCssAttribute(node);
                        }
                        else if (cssValue.arguments.length === 1) {
                            flattenCssCall(cssValue);
                        }
                        else {
                            replaceCssCallWithArray(cssValue);
                        }
                    }
                }
                else if (cssValue.type === utils_1.AST_NODE_TYPES.ObjectExpression) {
                    if (cssValue.properties.length === 0) {
                        removeEmptyCssAttribute(node);
                    }
                }
            },
            CallExpression: (node) => {
                if (!(node.callee.type === utils_1.AST_NODE_TYPES.Identifier &&
                    node.callee.name === "css")) {
                    return;
                }
                simplifyCssListLike(node.arguments);
            },
        };
    },
});
//# sourceMappingURL=simple-emotion-styles.js.map
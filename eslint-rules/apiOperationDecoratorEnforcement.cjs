module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce @ApiOperation decorator with summary on controller methods',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      missingDecorator: 'Controller methods must have @ApiOperation decorator',
      missingSummary: '@ApiOperation property summary required',
    },
  },

  create(context) {
    return {
      MethodDefinition(node) {
        // Check if we're in a class with Controller decorator
        const classNode = node.parent.parent;
        if (
          !classNode.decorators?.some(
            (d) =>
              d.expression.type === 'CallExpression' &&
              d.expression.callee.name === 'Controller',
          )
          || node.kind === 'constructor'
        ) {
          return;
        }

        // Check method decorators
        const decorators = node.decorators || [];
        const apiOperationDecorator = decorators.find(
          (d) =>
            d.expression.type === 'CallExpression' &&
            d.expression.callee.type === 'Identifier' &&
            d.expression.callee.name === 'ApiOperation',
        );

        if (!apiOperationDecorator) {
          context.report({
            node,
            messageId: 'missingDecorator',
          });
          return;
        }

        // Check if summary exists and is non-empty
        const args = apiOperationDecorator.expression.arguments;
        if (
          !args.length ||
          args[0].type !== 'ObjectExpression' ||
          !args[0].properties.some(
            (prop) =>
              prop.key.name === 'summary' &&
              prop.value.type === 'Literal' &&
              prop.value.value.trim() !== '',
          )
        ) {
          context.report({
            node: apiOperationDecorator,
            messageId: 'missingSummary',
          });
        }
      },
    };
  },
};

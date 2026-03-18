module.exports = {
	extends: ['stylelint-config-standard'],
	plugins: ['stylelint-order', 'stylelint-use-logical'],
	ignoreFiles: [
		'_design-tokens/**/*',
		'src/stories/**/*',
		'./coverage/**/*',
		'test-results/**/*',
		'playwright-report/**/*',
		'build/**/*',
	],
	rules: {
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'value',
					'define-mixin',
					'mixin',
					'theme',
					'apply',
					'plugin',
				],
			},
		],
		'block-no-empty': true,
		'color-no-invalid-hex': true,
		'csstools/use-logical': true,
		'custom-property-pattern': '-.+',
		'declaration-block-no-duplicate-properties': true,
		'declaration-block-no-redundant-longhand-properties': true,
		'declaration-block-no-shorthand-property-overrides': true,
		'declaration-no-important': true,
		'declaration-property-value-no-unknown': true,
		'import-notation': 'string',
		'length-zero-no-unit': true,
		'media-feature-range-notation': 'context',
		'max-nesting-depth': 4,
		'no-descending-specificity': null,
		'no-duplicate-selectors': true,
		'property-no-unknown': [
			true,
			{
				ignoreProperties: ['composes', 'composes-with'],
			},
		],
		'selector-class-pattern': '^([a-z][a-zA-Z0-9]*)([A-Z][a-zA-Z0-9]*)*$',
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: ['global'],
			},
		],
		'selector-pseudo-element-colon-notation': 'single',
		'order/properties-alphabetical-order': true,
	},
};

const { default: eslintPluginJsonc } = require('eslint-plugin-jsonc');
const js = require('@eslint/js');
const amber = require('eslint-config-amber');
const globals = require('globals');

module.exports = [
	...eslintPluginJsonc.configs['flat/recommended-with-json'],
	{
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'commonjs',
			globals: { ...globals.node }
		},
		rules: {
			...js.configs.recommended.rules,
			...amber.rules
		}
	}
];

module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	ignorePatterns: ["dist"],
	extends: ["plugin:vue/vue3-recommended", "airbnb-base", "plugin:prettier/recommended"],
	parserOptions: {
		parser: "babel-eslint",
		ecmaVersion: 2020,
		ecmaFeatures: {
			impliedStrict: true,
		},
		sourceType: "module",
	},
	plugins: ["vue"],
	rules: {
		"prettier/prettier": [
			"error",
			{
				printWidth: 160,
			},
		],
		"import/no-dynamic-require": 0,
		"one-var": 0,
		"import/no-extraneous-dependencies": [
			"error",
			{
				devDependencies: true,
				optionalDependencies: false,
				peerDependencies: true,
			},
		],
		"no-nested-ternary": 0,
		"no-use-before-define": 0,
		"global-require": 0,
		"no-underscore-dangle": 0,
		"consistent-return": 0,
		"no-param-reassign": 0,
		"no-plusplus": 0,
		"import/extensions": 0,
		"import/prefer-default-export": 0,
	},
};

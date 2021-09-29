module.exports = {
	targets: ">0.5%",
	assumptions: {
		noDocumentAll: true,
	},
	presets: [
		[
			"@babel/preset-env",
			{
				corejs: 3,
				useBuiltIns: "usage",
			},
		],
	],
	plugins: ["@babel/plugin-proposal-optional-chaining"],
};

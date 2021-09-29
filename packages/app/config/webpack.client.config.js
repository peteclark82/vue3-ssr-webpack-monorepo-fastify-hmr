const { merge } = require("webpack-merge"),
	{ BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const baseWebpackConfig = require("./webpack.base.config.js"),
	config = require("./full.config.js");

module.exports = merge(baseWebpackConfig, {
	target: "web",
	entry: { "entry-client": config.input.entries.client },
	output: {
		path: config.output.build.client,
	},
	optimization: {
		minimize: true,
		runtimeChunk: "single",
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				defaultVendors: {
					name(module) {
						if (!module.resource) {
							return;
						}
						const packageNamePattern = /[\\/]node_modules[\\/]@*(.*?)([\\/|$])/;
						const packageNameMatch = module.resource.match(packageNamePattern);
						if (!packageNameMatch) {
							return;
						}
						return `vendor-${packageNameMatch[1]}`;
					},
				},
			},
		},
	},
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: "static",
			openAnalyzer: config.openAnalyzer.client,
			reportFilename: config.output.bundleAnalyzer.client.reportFilename,
		}),
	],
});

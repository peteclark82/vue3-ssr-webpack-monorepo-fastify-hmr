const webpack = require("webpack"),
	{ merge } = require("webpack-merge"),
	nodeExternals = require("webpack-node-externals"),
	{ BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const baseWebpackConfig = require("./webpack.base.config.js"),
	config = require("./full.config.js");

module.exports = merge(baseWebpackConfig, {
	target: "node",
	entry: { "entry-server": config.input.entries.server },
	output: {
		library: {
			type: "commonjs",
		},
		path: config.output.build.server,
	},
	externals: [nodeExternals({ allowlist: /\.(css|vue)$/ })],
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: "static",
			openAnalyzer: config.openAnalyzer.server,
			reportFilename: config.output.bundleAnalyzer.server.reportFilename,
		}),
	],
});

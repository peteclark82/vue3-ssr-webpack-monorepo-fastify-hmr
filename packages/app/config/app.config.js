const path = require("path");

module.exports = {
	devMiddleware: {
		writeToDisk: true,
	},
	babelNamespacesToInclude: ["@vue3-ssr-blueprint"],
	input: {
		entries: {
			client: path.resolve(__dirname, "../src/entry-client.js"),
			server: path.resolve(__dirname, "../src/entry-server.js"),
		},
		assets: {
			pageTemplate: path.resolve(__dirname, "../src/client/index.html"),
		},
	},
	output: {
		manifestFilename: "ssr-manifest.json",
		bundleAnalyzer: {
			client: {
				reportFilename: path.resolve(__dirname, "../reports/client-bundle-report.html"),
			},
			server: {
				reportFilename: path.resolve(__dirname, "../reports/server-bundle-report.html"),
			},
		},
		build: {
			client: path.resolve(__dirname, "../dist/client"),
			server: path.resolve(__dirname, "../dist/server"),
		},
		publicPath: "/static/",
		assets: {
			javascript: {
				base: "assets/js",
				filename: "[id].[chunkhash:8].js",
			},
			images: {
				base: "assets/img",
				filename: "[name].[hash:8].[ext]",
			},
			css: {
				base: "assets/css",
				filename: "[id].[chunkhash:8].css",
			},
			sourceMaps: {
				filename: "[file].map",
			},
			pageTemplate: {
				client: "index.html",
			},
		},
	},
};

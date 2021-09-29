const appConfig = require("./app.config.js");

const isDevelopment = process.env.NODE_ENV !== "production";
const babelNamespacesToInclude = Array.isArray(appConfig.babelNamespacesToInclude) ? appConfig.babelNamespacesToInclude : [appConfig.babelNamespacesToInclude];

module.exports = {
	isDevelopment,
	buildMode: isDevelopment ? "development" : "production",
	/* Disable output folder cleaning when using hot-middleware as bug causes files to be missing from output (such as favicon.ico)
			REF: https://github.com/webpack/webpack-dev-middleware/issues/861 */
	enableOutputFolderCleaning: !isDevelopment,
	/* Exclude all node_modules from babel except for those in local mono-repo namespace */
	babelLoaderExclude: {
		and: [
			/node_modules/,
			{
				not: babelNamespacesToInclude.map((pattern) => new RegExp(pattern)),
			},
		],
	},
	/* Don't resolve symlinks, so locally linked packages from within the mono-repo are treated like they would be if installed properly */
	resolveSymlinks: false,
	devTool: isDevelopment ? "eval-source-map" : "source-map",
	openAnalyzer: {
		client: process.env.SHOW_BUNDLE_ANALYZER_CLIENT === "true",
		server: process.env.SHOW_BUNDLE_ANALYZER_SERVER === "true",
	},
};

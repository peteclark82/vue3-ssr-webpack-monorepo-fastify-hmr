const path = require("path"),
	fs = require("fs"),
	fsp = fs.promises;

const fastifyStatic = require("fastify-static");

module.exports = class PreBuiltAssetResolver {
	constructor({ webpackConfig, server }) {
		this.webpackConfig = webpackConfig;
		this.server = server;
	}

	register() {
		const { publicPath } = this.webpackConfig.server.output;
		const clientBuildOutputPath = this.webpackConfig.client.output.path;
		this.server.register(fastifyStatic, {
			root: clientBuildOutputPath,
			prefix: publicPath,
		});
	}

	resolveAsset(bundleName, assetName) {
		const bundleWebpackConfig = this.webpackConfig[bundleName];
		const outputPath = bundleWebpackConfig.output.path;
		const assetPath = path.resolve(outputPath, assetName);
		return assetPath;
	}

	async getAsset(bundleName, assetName) {
		const assetFilename = this.resolveAsset(bundleName, assetName);
		const assetContents = await fsp.readFile(assetFilename);
		return assetContents;
	}

	async importAsset(bundleName, assetName) {
		const assetFilename = this.resolveAsset(bundleName, assetName);
		const importedModule = require(assetFilename);
		return importedModule;
	}
};

const HotReloadAssetResolver = require("./HotReloadAssetResolver.js"),
	PreBuiltAssetResolver = require("./PreBuiltAssetResolver.js");

module.exports = class {
	constructor({ webpackConfig, server, devMiddleware }) {
		this.buildMode = webpackConfig.server.mode;
		this.isDevelopment = this.buildMode === "development";

		this.webpackConfig = webpackConfig;
		this.server = server;
		this.devMiddleware = devMiddleware;

		this.assetResolver = null;
	}

	async register() {
		const AssetResolver = this.isDevelopment ? HotReloadAssetResolver : PreBuiltAssetResolver;

		console.log(`Build mode is '${this.buildMode}' using '${AssetResolver.name}'`);
		this.assetResolver = new AssetResolver({
			server: this.server,
			webpackConfig: this.webpackConfig,
			devMiddleware: this.devMiddleware,
		});
		await this.assetResolver.register();
	}

	resolveAsset(bundleName, assetName) {
		return this.assetResolver.resolveAsset(bundleName, assetName);
	}

	async getAsset(bundleName, assetName) {
		return this.assetResolver.getAsset(bundleName, assetName);
	}

	async importAsset(bundleName, assetName) {
		return this.assetResolver.importAsset(bundleName, assetName);
	}
};

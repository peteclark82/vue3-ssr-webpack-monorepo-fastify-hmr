const path = require("path");

const serialize = require("serialize-javascript"),
	cloneDeep = require("clone-deep");

module.exports = class {
	constructor({ webpackConfig, staticAssetHandler, filenames }) {
		this.webpackConfig = webpackConfig;
		this.staticAssetHandler = staticAssetHandler;
		this.filenames = filenames;

		this.buildMode = webpackConfig.server.mode;
		this.isDevelopment = this.buildMode === "development";
		this.createApp = null;
	}

	async renderToString({ initialState: originalInitialState, url }) {
		const initialState = cloneDeep(originalInitialState);

		const createApp = await this.#getCreateApp();
		const { app, router, appState, renderToString } = await createApp(initialState);

		router.push(url);
		await router.isReady();
		const matchedComponents = router.currentRoute.value.matched;
		if (matchedComponents.length === 0) {
			throw new Error("Route not found");
		}

		const originalHtml = (await this.staticAssetHandler.getAsset("client", this.filenames.pageTemplate)).toString();

		const appHtml = await renderToString(app);
		const stateHtml = `<script>window.INITIAL_STATE = ${serialize(appState)}</script>`;

		const finalHtml = originalHtml.replace('<div id="app">', `${stateHtml}<div id="app">${appHtml}`);

		return finalHtml;
	}

	#getCreateApp = async () => {
		const manifestJson = await this.#getManifestJson();
		const mainEntryKey = this.#getMainEntryKey();

		const mainEntryUrl = manifestJson[mainEntryKey];
		const mainEntryLocalPath = this.#translateOutputUrlToLocalPath(this.webpackConfig.server, mainEntryUrl);

		const importedModule = await this.staticAssetHandler.importAsset("server", mainEntryLocalPath);
		this.createApp = importedModule.default;

		return this.createApp;
	};

	#getMainEntryKey = () => {
		const entryKeys = Object.keys(this.webpackConfig.server.entry);
		const mainEntryKey = entryKeys[0];
		return mainEntryKey;
	};

	#getManifestJson = async () => {
		const manifestBuffer = await this.staticAssetHandler.getAsset("server", this.filenames.manifest);
		const manifestJson = JSON.parse(manifestBuffer.toString());
		return manifestJson;
	};

	#translateOutputUrlToLocalPath = (webpackConfig, outputPath) => {
		const relativePath = outputPath.replace(webpackConfig.output.publicPath, "");
		const inputPath = path.join(webpackConfig.output.path, relativePath);
		return inputPath;
	};
};

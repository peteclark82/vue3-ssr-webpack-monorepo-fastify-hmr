const path = require("path");

const webpack = require("webpack"),
	devMiddleware = require("webpack-dev-middleware"),
	hotMiddleware = require("webpack-hot-middleware"),
	cloneDeep = require("clone-deep");

const importModuleFromString = require("./importModuleFromString.js");

const WEBPACK_HOT_MIDDLEWARE_OPTIONS_PATH = "/__webpack_hmr";
const WEBPACK_HOT_MIDDLEWARE_OPTIONS_COMPILER_NAME = "client";
const WEBPACK_HOT_MIDDLEWARE_CLIENT_PATH = `webpack-hot-middleware/client?path=${WEBPACK_HOT_MIDDLEWARE_OPTIONS_PATH}&name=${WEBPACK_HOT_MIDDLEWARE_OPTIONS_COMPILER_NAME}`;

module.exports = class HotReloadAssetResolver {
	constructor({ webpackConfig, server, devMiddleware: devMiddlewareConfig }) {
		this.server = server;
		this.webpackConfig = webpackConfig;
		this.compiler = null;
		this.devMiddleware = devMiddlewareConfig;
	}

	async register() {
		const webpackClientConfig = this.#getWebpackClientConfig();
		const webpackServerConfig = this.#getWebpackServerConfig();

		this.compiler = webpack([
			{ name: "client", ...webpackClientConfig },
			{ name: "server", ...webpackServerConfig },
		]);

		this.compiler.hooks.done.tap("HotReloadAssetResolver", (stats) => {
			const statsJson = stats.toJson();
			if (stats.hasErrors()) {
				console.error("webpack build error!");
				console.error(statsJson.errors);
			} else {
				console.log("webpack successful build");
			}
		});

		await this.server.register(require("fastify-express"));
		await this.server.use(
			devMiddleware(this.compiler, {
				stats: "none",
				...this.devMiddleware,
			})
		);
		await this.server.use(
			hotMiddleware(this.compiler, {
				heartbeat: 5000,
				path: WEBPACK_HOT_MIDDLEWARE_OPTIONS_PATH,
				name: WEBPACK_HOT_MIDDLEWARE_OPTIONS_COMPILER_NAME,
			})
		);
	}

	resolveAsset(bundleName, assetName) {
		const compiler = this.compiler.compilers.find(({ name }) => name === bundleName);
		const lastCompilation = compiler._lastCompilation;
		const outputPath = lastCompilation.outputOptions.path;
		const assetPath = lastCompilation.getPath(assetName);
		const absoluteAssetPath = path.resolve(outputPath, assetPath);
		return absoluteAssetPath;
	}

	async getAsset(bundleName, assetName) {
		const compiler = this.compiler.compilers.find(({ name }) => name === bundleName);
		const lastCompilation = compiler._lastCompilation;
		const outputPath = lastCompilation.outputOptions.path;
		const assetPath = lastCompilation.getPath(assetName);
		const absoluteAssetPath = path.resolve(outputPath, assetPath);
		const contents = await compiler.outputFileSystem.promises.readFile(absoluteAssetPath);
		return contents;
	}

	async importAsset(bundleName, assetName) {
		const contents = await this.getAsset(bundleName, assetName);
		const importedModule = importModuleFromString(contents);
		return importedModule;
	}

	#getWebpackClientConfig = () => {
		const clientConfig = cloneDeep(this.webpackConfig.client);
		const isAlreadyObject = typeof clientConfig.entry !== "string" && !Array.isArray(clientConfig.entry);
		const entries = isAlreadyObject ? clientConfig.entry : { [clientConfig.entry]: clientConfig.entry };
		Object.entries(entries).forEach(([k, v]) => {
			entries[k] = Array.isArray(v) ? v : [v];
			entries[k].unshift(WEBPACK_HOT_MIDDLEWARE_CLIENT_PATH);
		});
		clientConfig.entry = entries;
		clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin());
		this.#overrideBaseWebpackConfig(clientConfig);
		return clientConfig;
	};

	#getWebpackServerConfig = () => {
		const serverConfig = cloneDeep(this.webpackConfig.server);
		this.#overrideBaseWebpackConfig(serverConfig);
		return serverConfig;
	};

	#overrideBaseWebpackConfig = (config) => {
		config.resolve = config.resolve || {};
		config.resolve.modules = config.resolve.modules || [];
		config.resolve.modules.push(path.resolve(__dirname, "../node_modules"), path.resolve(__dirname, "../../../node_modules"), "node_modules");
	};
};

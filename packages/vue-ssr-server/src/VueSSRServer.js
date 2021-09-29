const fastify = require("fastify"),
	fastifyCompress = require("fastify-compress");

const StaticAssetHandler = require("./StaticAssetHandler.js"),
	PageRenderer = require("./PageRenderer.js");

module.exports = class {
	constructor({ webpackConfig, filenames, devMiddleware }) {
		this.webpackConfig = webpackConfig;
		this.filenames = filenames;
		this.devMiddleware = devMiddleware;

		this.server = null;
		this.staticAssetHandler = null;
		this.pageRenderer = null;
	}

	async create() {
		this.server = fastify({ disableRequestLogging: true, logger: { prettyPrint: true, level: "info" } });
		this.server.register(fastifyCompress, { global: true });

		this.staticAssetHandler = new StaticAssetHandler({
			server: this.server,
			webpackConfig: this.webpackConfig,
			devMiddleware: this.devMiddleware,
		});
		this.pageRenderer = new PageRenderer({ webpackConfig: this.webpackConfig, staticAssetHandler: this.staticAssetHandler, filenames: this.filenames });

		return { server: this.server, pageRenderer: this.pageRenderer };
	}

	async start({ port = 8080 } = {}) {
		if (!this.staticAssetHandler) {
			throw new Error("You must create the VueSSRServer before starting");
		}

		await this.staticAssetHandler.register();
		await this.server.listen(port);

		process.on("SIGINT", () => {
			console.log("gracefully shutting down from SIGINT (Crtl-C)");
			this.server.close();
			process.exit(0);
		});

		return this.server;
	}
};

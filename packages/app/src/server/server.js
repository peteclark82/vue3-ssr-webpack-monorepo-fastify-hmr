const VueSSRServer = require("@vue3-ssr-blueprint/vue-ssr-server");

const config = require("../../config/full.config.js"),
	webpackConfig = {
		client: require("../../config/webpack.client.config.js"),
		server: require("../../config/webpack.server.config.js"),
	},
	{ version: packageVersion } = require("../../package.json");

const serverState = {
	version: packageVersion,
};

main();

async function main() {
	const vueSSRServer = new VueSSRServer({
		webpackConfig,
		filenames: {
			pageTemplate: config.output.assets.pageTemplate.client,
			manifest: config.output.manifestFilename,
		},
		devMiddleware: config.devMiddleware || {},
	});

	const { server, pageRenderer } = await vueSSRServer.create();

	const initialState = {
		server: serverState,
		count: 1,
	};

	await server.get("*", async (req, reply) => {
		try {
			const pageHtml = await pageRenderer.renderToString({ initialState, url: req.url });
			reply.header("Content-Type", "text/html");
			reply.send(pageHtml);
		} catch (e) {
			console.error(`Server Error processing URL '${req.url}'\n`, e.stack);
			reply.header("Content-Type", "text/html");
			reply.status(500);
			reply.send(JSON.stringify(e, null, 2));
		}
	});

	await vueSSRServer.start();
}

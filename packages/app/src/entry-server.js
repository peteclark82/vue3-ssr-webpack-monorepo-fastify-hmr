import { renderToString } from "@vue/server-renderer";
import createApp from "./client/app.js";

export default (initialState) => {
	const { app, router, appState } = createApp(initialState);

	return { app, router, appState, renderToString };
};

import { createSSRApp, h, reactive, provide } from "vue";

import App from "./App.vue";
import createRouter from "./router.js";

export default (initialState) => {
	const appState = reactive(initialState);

	const app = createSSRApp({
		setup() {
			provide("appState", appState);
		},
		components: { App },
		render: () => h(App),
	});

	const router = createRouter();
	app.use(router);

	return {
		app,
		router,
		appState,
	};
};

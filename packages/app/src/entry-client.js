import createApp from "./client/app.js";

const initialState = window.INITIAL_STATE;

const { app, router } = createApp(initialState);

router.isReady().then(() => {
	app.mount("#app", true);
});

import { createRouter, createMemoryHistory, createWebHistory } from "vue-router";

export default function () {
	const isServer = typeof window === "undefined";
	const history = isServer ? createMemoryHistory() : createWebHistory();
	const routes = [
		{
			path: "/",
			name: "Home",
			component: () => import(/* webpackChunkName: 'route-home' */ "./routes/Home.vue"),
		},
		{
			path: "/about",
			name: "About",
			component: () => import(/* webpackChunkName: 'route-about' */ "./routes/About.vue"),
		},
	];

	const router = createRouter({
		history,
		routes,
	});

	return router;
}

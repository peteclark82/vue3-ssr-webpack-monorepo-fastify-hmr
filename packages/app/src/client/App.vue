<template>
	<div class="app">
		<h1>APP</h1>
		<div id="nav">
			<router-link to="/">Home</router-link> |
			<router-link to="/about">About</router-link>
		</div>
		<div>
			<routerView />
		</div>
	</div>
</template>

<script>
import { onServerPrefetch } from "vue";
import useTestBehaviour from "./behaviours/useTestBehaviour.js";

export default {
	setup() {
		const { appState, incrementCount } = useTestBehaviour();
		onServerPrefetch(() => {
			incrementCount();
		});
		return { appState };
	},
};
</script>

<style scoped>
.app {
	background-color: green;
}
</style>

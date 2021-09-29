<template>
	<h1>EXAMPLE COMPONENT {{ appState?.count }}</h1>
	<img src="./assets/img/cat-meme.jpg" />
</template>

<script>
import { inject } from "vue";

export default {
	setup() {
		const appState = inject("appState");
		return { appState };
	},
};
</script>

<style scoped>
h1 {
	color: purple;
}
</style>

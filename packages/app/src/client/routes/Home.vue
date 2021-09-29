<template>
	<div class="home">
		<h2>HOMEd ({{ appState?.server?.version }} - {{ appState.count }})</h2>
		<example-component />
	</div>
</template>

<script>
import { ExampleComponent } from "@vue3-ssr-blueprint/components";
import useTestBehaviour from "../behaviours/useTestBehaviour.js";

export default {
	components: { ExampleComponent },
	setup() {
		const { appState } = useTestBehaviour();
		return { appState };
	},
};
</script>

<style scoped>
.home {
	background-color: red;
	font-size: 12px;
}
</style>

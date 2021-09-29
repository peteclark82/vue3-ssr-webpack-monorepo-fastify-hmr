<template>
	<div class="about">ABOUT PAGE</div>
	<example-component />
</template>

<script>
import { ExampleComponent } from "@vue3-ssr-blueprint/components";

export default {
	components: { ExampleComponent },
};
</script>

<style scoped>
.about {
	background-color: orange;
	font-size: 12px;
}
</style>

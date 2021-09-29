import { inject } from "vue";

export default () => {
	const appState = inject("appState");

	const incrementCount = () => {
		appState.count++;
	};

	return { appState, incrementCount };
};

import App from './svelte/App.svelte';

//maybe switch here based on the document extension this interactable is targeting?
const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;
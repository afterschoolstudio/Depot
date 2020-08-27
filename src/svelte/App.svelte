<script>
	import InteractableData from './InteractableData.svelte';
    // import InteractableName from './InteractableName.svelte';
</script>

<main>
	<!-- <h1>Helloowo {InteractableName.iname}!</h1> -->
	<h1>Test</h1>
	<InteractableData/>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
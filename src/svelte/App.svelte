<script>
	import InteractableData from './InteractableData.svelte';
	// import { getContext } from 'svelte';
    // var { data } = getContext("data");
</script>

<main>
	<InteractableData/>
</main>

<style>
	main {
		text-align: left;
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
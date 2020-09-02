<script>
	import InteractableData from './InteractableData.svelte';
	import TerrainData from './TerrainData.svelte';
    import { onMount } from 'svelte';

	onMount(() => {
        vscode.postMessage({
            type: 'get-type',
		});
	});

	let dataType = ""
	function windowMessage(event) {
        const message = event.data; // The json data that the extension sent
		switch (message.type) {
            case 'get-type':
				dataType = message.text;
				return;
		}
    }
	// import { getContext } from 'svelte';
	// var { data } = getContext("data");
</script>

<svelte:window on:message={windowMessage}/>
{#if dataType == ""}
<p>Loading</p>
{:else if dataType === "interactable"}
<InteractableData/>
{:else if dataType === "terrain"}
<TerrainData/>
{:else if dataType === "ruleset"}
<p>Ruleset not implemented</p>
{:else if dataType === "faction"}
<p>Faction not implemented</p>
{:else if dataType === "supply"}
<p>Supply not implemented</p>
{:else}
<p>Error: Invalid Data Type {dataType}</p>
{/if}

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
<script>
    import { createEventDispatcher } from 'svelte';

    export let data;
    export let options = [];
    export let aliases = [];
    const dispatch = createEventDispatcher();
    function fieldUpdated() {
        dispatch('message', {
            "type" : "update"
        });
    }
</script>
<!-- svelte-ignore a11y-no-onchange -->
<select bind:value={data} on:change={fieldUpdated}>
    <option value="">
        <!-- always have an empy option -->
    </option>
    {#each options as option, i}
    <option value={option}>
        {#if aliases.length == options.length && aliases.length > 0}
            {aliases[i]}
        {:else}
            {option}
        {/if}
    </option>
    {/each}
</select>
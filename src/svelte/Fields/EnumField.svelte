<script>
    import { createEventDispatcher } from 'svelte';

    export let data;
    export let options;
    const dispatch = createEventDispatcher();
    function fieldUpdated() {
        dispatch('message', {
            "type" : "update"
        });
    }
</script>
<!-- svelte-ignore a11y-no-onchange -->
<select bind:value={data} on:change={fieldUpdated}>
    {#each options as option}
    <option value={option}>
        {option}
    </option>
    {/each}
</select>
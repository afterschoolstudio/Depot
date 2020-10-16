<script>
    import { createEventDispatcher } from 'svelte';

    export let data;
    export let sheetGUID;
    export let options;
    export let displayType = "vertical";
    const dispatch = createEventDispatcher();
    function fieldUpdated() {
        dispatch('message', {
            "type" : "update",
            "data" : {
                "sheetGUID" : sheetGUID
            }
        });
    }

</script>
{#each options as option}
<label>
    <input type=checkbox bind:group={data} value={option} on:change={fieldUpdated}>
    {option}
</label>
    {#if displayType == "vertical"}
    <br>
    {/if}
{/each}
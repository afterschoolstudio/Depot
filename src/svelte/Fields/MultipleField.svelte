<script>
export let data;
export let options;
export let displayType = "vertical";
</script>
{#each options as option}
<label>
    <input type=checkbox bind:group={data} value={option}>
    {option}
</label>
    {#if displayType == "vertical"}
    <br>
    {/if}
{/each}
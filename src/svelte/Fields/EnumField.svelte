<script>
export let data;
export let options = [];
export let aliases = [];
export let allowEmpty = true;
</script>
<!-- svelte-ignore a11y-no-onchange -->
<select bind:value={data}>
    {#if allowEmpty}
        <option value="">
        </option>
    {/if}
    {#each options as option, i}
    <option value={option} selected={data === option}>
        {#if aliases.length == options.length && aliases.length > 0}
            {aliases[i]}
        {:else}
            {option}
        {/if}
    </option>
    {/each}
</select>
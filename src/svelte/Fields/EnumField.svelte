<script>
  export let data;
  export let options = [];
  export let aliases = [];
  export let allowEmpty = true;
  import AutoComplete from "./Autocomplete.svelte";
</script>

<AutoComplete
  items={options}
  {aliases}
  {allowEmpty}
  keywordsFunction={(text) => {
    if (aliases.length === options.length && aliases.length > 0)
      return aliases[options.findIndex((o) => o === text)];
    return text;
  }}
  bind:selectedItem={data}
/>
<!-- svelte-ignore a11y-no-onchange -->
<!-- <input list={enumId} class="fullWidth sheetButton" bind:value={data} />
<datalist id={enumId}>
  {#if allowEmpty}
    <option value="" />
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
</datalist> -->

<!-- <select class="fullWidth sheetButton" bind:value={data}>
  {#if allowEmpty}
    <option value="" />
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
</select> -->
<style>
  .fullWidth {
    width: 100%;
  }

  .sheetButton {
    background-color: #3a3a3a;
    border: none;
    color: white;
    display: inline-block;
    cursor: pointer;
    margin: 0px 5px 0px 0px;
    padding: 8px 8px 8px 8px;
  }
  .sheetButton:hover {
    background-color: #252526;
  }
  .sheetButton.selected {
    background-color: #252526;
  }
  .sheetButton:focus {
    outline: none;
    box-shadow: none;
  }
  .sheetButton:active:focus {
    outline: none;
    box-shadow: none;
  }
</style>

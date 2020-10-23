<script>
import EnumField from '../EnumField.svelte';
export let data;
export let sheetGUID;
export let config;
</script>

{#if sheetGUID !== ""}
<!-- sheet assigned -->
<EnumField  bind:data={data}
            options={config.depotInfo.lines[sheetGUID].guids}
            aliases={config.depotInfo.lines[sheetGUID].names}/>
{:else}
<!-- sheet not assigned -->
<EnumField  bind:data={data}
            options={[]}
            aliases={[]}/>
{/if}
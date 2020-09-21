<script>
import { createEventDispatcher } from 'svelte';
import { each } from 'svelte/internal';
import DepotTable from './DepotTable.svelte';
export let data;

const dispatch = createEventDispatcher();
function sheetsUpdated() {
    dispatch('message', {
        "type" : "update"
    });
}

let selectedSheet = 0;
function createSheet() {
    console.log("button clicked"); 
    data.sheets.push({
        "name" : "newSheet",
        "columns": [],
        "lines": []
    });
    sheetsUpdated(); 
}

function focusSheet(index) {
    selectedSheet = index;
}
</script>

<h1>Depot DB</h1>
{#if !data.hasOwnProperty("sheets")}
    <p>Invalid Depot File</p>
{:else}
    <button on:click={createSheet}>New Sheet</button>
    <br>
    {selectedSheet}
    <br>
    {#if data.sheets.length === 0}
       <p>No sheets</p>
    {:else}
        {#each data.sheets as sheet}
            <button on:click={focusSheet(data.sheets.indexOf(sheet))}>{sheet.name}</button>
        {/each}
        <DepotTable bind:data={data.sheets[selectedSheet]} on:message/>
    {/if}
{/if}
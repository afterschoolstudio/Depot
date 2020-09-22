<script>
import { createEventDispatcher, setContext } from 'svelte';
import DepotOptions from './DepotOptions.svelte';
import DepotTable from './DepotTable.svelte';
import SheetConfigEditor from './SheetConfigEditor.svelte';
export let data;

const dispatch = createEventDispatcher();
function sheetsUpdated() {
    dispatch('message', {
        "type" : "update"
    });
}

setContext("editor", {
    "active" : false,
});

let selectedSheet = 0;
function focusSheet(index) {
    selectedSheet = index;
}

function handleEditorOperation(event) {

}

let editorData = {"active" : false}
function handleOptions(event) {
    switch (event.detail.type) {
        case "editorUpdate":
            editorData = event.detail.data;
            break;
        default:
            break;
    }
}

</script>
 
<h1>Depot DB</h1>
{#if !data.hasOwnProperty("sheets")}
    <p>Invalid Depot File</p>
{:else}
    <br>
    Selected: {selectedSheet}
    <br>
    <DepotOptions on:message={handleOptions} columnEditorsDisabled={data.sheets.length == 0}/>
    {#if data.sheets.length === 0}
       <p>No sheets</p>
    {:else}
        {#each data.sheets as sheet}
            <button on:click={focusSheet(data.sheets.indexOf(sheet))}>{sheet.name}</button>
        {/each}
        <SheetConfigEditor bind:data={editorData} on:message={handleEditorOperation}/>
        <DepotTable bind:data={data.sheets[selectedSheet]} on:message/>
    {/if}
{/if}
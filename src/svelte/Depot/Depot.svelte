<script>
import { createEventDispatcher } from 'svelte';
import {defaults} from './depotDefaults';
import DepotOptions from './DepotOptions.svelte';
import DepotTable from './DepotTable.svelte';
import DepotConfigurator from './DepotConfigurator.svelte';
export let data;

const dispatch = createEventDispatcher();
function sheetsUpdated() {
    dispatch('message', {
        "type" : "update"
    });
}

let selectedSheet = 0;
function focusSheet(index) {
    selectedSheet = index;
}

function getBannedNames() {
    var sheetNames = [];
    for(var o in data.sheets) {
        sheetNames.push(data.sheets[o].name);
    }
    var columnNames = [];
    if (data.sheets.length !== 0 && data.sheets[selectedSheet].columns.length !== 0) {
        for(var o in data.sheets[selectedSheet].columns) {
            columnNames.push(data.sheets[selectedSheet].columns[o].name);
        }
    }
    return { "sheetNames" : sheetNames, "columnNames" : columnNames}
}

let editorConfig = {"active" : false}
let editorData = {}
function handleOptions(event) {
    //event.detail.type assumed to be editorUpdate
    switch (event.detail.data.operation) {
        case "new":
            editorConfig = event.detail.data;
            editorConfig["bannedNames"] = getBannedNames();
            editorData = JSON.parse(JSON.stringify(defaults[editorConfig.editType]));
            break;
        case "edit":
            //not implemented
            // editorConfig = event.detail.data;
            // editorData = JSON.parse(JSON.stringify(defaults[editorConfig.editType]));
            break;
        default:
            break;
    }
}

function handleConfigUpdate(event) {
    switch (event.detail.type) {
        case "create":
            switch (editorConfig.editType) {
                case "sheet":
                    console.log(editorData);
                    data.sheets.push(editorData);
                    break;
                default: //column
                    data.sheets[selectedSheet].columns.push(editorData);
                    break;
            }
            editorConfig = {"active":false};
            sheetsUpdated();
            break;
        case "save":
            
            editorConfig = {"active":false};
            sheetsUpdated();
            break;
        case "delete":
            
            editorConfig = {"active":false};
            sheetsUpdated();
            break;
        case "close":
            
            editorConfig = {"active":false};
            break;
        default:
            editorConfig = {"active":false};
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
       <DepotConfigurator data={editorConfig.active ? editorData : {}} config={editorConfig} on:message={handleConfigUpdate}/>
    {:else}
        {#each data.sheets as sheet}
            <button on:click={focusSheet(data.sheets.indexOf(sheet))}>{sheet.name}</button>
        {/each}
        <DepotConfigurator data={editorConfig.active ? editorData : {}} config={editorConfig} on:message={handleConfigUpdate}/>
        <DepotTable bind:data={data.sheets[selectedSheet]} on:message/>
    {/if}
{/if}
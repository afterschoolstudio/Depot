<script>
import { createEventDispatcher } from 'svelte';
import {defaults} from './depotDefaults';
import DepotOptions from './DepotOptions.svelte';
import DepotTable from './DepotTable.svelte';
import DepotConfigurator from './DepotConfigurator.svelte';
import { v4 as uuidv4 } from 'uuid';
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

function getBannedNames(config) {
    var sheetNames = [];
    for(var o in data.sheets) {
        if(config.operation === "new" || 
          (config.operation === "edit" && (data.sheets[o].name !== data.sheets[selectedSheet].name)))
        {
            //this means its the currently open sheet, we dont add our name to the banned list, only others
            sheetNames.push(data.sheets[o].name);
        }
    }
    var columnNames = [];
    if (data.sheets.length !== 0 && data.sheets[selectedSheet].columns.length !== 0) {
        for(var o in data.sheets[selectedSheet].columns) {
            if(config.operation === "new" || 
              (config.operation === "edit" && (data.sheets[selectedSheet].columns[o].name !== config.editType)))
            {
                //this means its the currently open column, we dont add our name to the banned list, only others
                columnNames.push(data.sheets[selectedSheet].columns[o].name);
            }
        }
    }
    return { "sheetNames" : sheetNames, "columnNames" : columnNames}
}

let editorConfig = {"active" : false}
let editorData = {}
function handleOptions(event) {
    switch (event.detail.type) {
        case "editorUpdate":
            editorConfig = event.detail.data;
            editorConfig["bannedNames"] = getBannedNames(editorConfig);
            switch (event.detail.data.operation) {
                case "new":
                    editorData = JSON.parse(JSON.stringify(defaults[editorConfig.editType]));
                    break;
                case "edit":
                    switch (event.detail.data.editType) {
                        case "sheet":
                            editorData = JSON.parse(JSON.stringify(data.sheets[selectedSheet]));
                            break;
                        default: //column
                            editorData = JSON.parse(JSON.stringify(data.sheets[selectedSheet].columns.find(x => x.name === editorConfig.editType)));
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;
        case "sheetUpdate":
            switch (event.detail.data.operation) {
                case "newLine":
                    var newLine = {};
                    newLine["guid"] = uuidv4();
                    data.sheets[selectedSheet].columns.forEach(column => {
                        newLine[column.name] = column.defaultValue;
                    });
                    data.sheets[selectedSheet].lines.push(newLine);
                    sheetsUpdated();
                    break;
            }
            break;
    }
}

function handleConfigUpdate(event) {
    switch (event.detail.type) {
        case "create":
            switch (editorConfig.editType) {
                case "sheet":
                    data.sheets.push(editorData);
                    selectedSheet = data.sheets.length - 1;
                    break;
                default: //column
                    data.sheets[selectedSheet].columns.push(editorData);
                    data.sheets[selectedSheet].lines.forEach(line => {
                        line[editorData.name] = editorData.defaultValue;
                    });
                    break;
            }
            editorConfig = {"active":false};
            sheetsUpdated();
            break;
        case "save":
            switch (editorConfig.editType) {
                case "sheet":
                    data.sheets[selectedSheet] = editorData;
                    //TODO: need to update other sheet columns that reference this?
                    break;
                default: //column
                    var index = data.sheets[selectedSheet].columns.findIndex(x => x.name === editorConfig.editType); //old name
                    data.sheets[selectedSheet].columns[index] = editorData; //column now has new name maybe
                    //update line entries if column name changed
                    if(editorConfig.editType !== editorData.name)
                    {
                        data.sheets[selectedSheet].lines.forEach(line => {
                            //assing the new key the old value
                            line[editorData.name] = line[editorConfig.editType];
                            //delete the old entry
                            delete line[editorConfig.editType];
                        });
                        //TODO: may need to do more here if column name change was referenced by other sheet?
                    }
                    break;
            }
            editorConfig = {"active":false};
            sheetsUpdated();
            break;
        case "delete":
            switch (editorConfig.editType) {
                case "sheet":
                    data.sheets.splice(selectedSheet,1);
                    if(selectedSheet >= data.sheets.length)
                    {
                        selectedSheet = selectedSheet - 1 < 0 ? 0 : selectedSheet - 1;
                    }
                    //TODO: need to update other sheet columns that reference this?
                    break;
                default: //column
                    var index = data.sheets[selectedSheet].columns.findIndex(x => x.name === editorConfig.editType); //old name
                    data.sheets[selectedSheet].lines.forEach(line => {
                        //delete the entry for this column
                        delete line[editorConfig.editType];
                    });
                    //delete the column
                    data.sheets[selectedSheet].columns.splice(index,1);
                    //TODO: may need to do more here if column name change was referenced by other sheet?
                    break;
            }
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

function handleTableAction(event) {
    switch (event.detail.type) {
        case "editorUpdate":
            //pass the editor update to the editor update handler
            handleOptions(event);
            break;
        case "update":
            sheetsUpdated();
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
    <DepotOptions on:message={handleOptions} allDisabled={editorConfig.active} editSheetDisabled={data.sheets.length == 0} addLineDisabled={data.sheets.length == 0 || data.sheets[selectedSheet].columns.length == 0}/>
    {#if data.sheets.length === 0}
       <DepotConfigurator data={editorConfig.active ? editorData : {}} config={editorConfig} on:message={handleConfigUpdate}/>
    {:else}
        {#each data.sheets as sheet}
            <button on:click={focusSheet(data.sheets.indexOf(sheet))} disabled={editorConfig.active}>{sheet.name}</button>
        {/each}
        <DepotConfigurator data={editorConfig.active ? editorData : {}} config={editorConfig} on:message={handleConfigUpdate}/>
        {#if !editorConfig.active}
            <!-- hide the table if editing a field to prevent sending the sheetupdate -->
            <DepotTable bind:data={data.sheets[selectedSheet]} on:message={handleTableAction}/>
        {/if}
    {/if}
{/if}
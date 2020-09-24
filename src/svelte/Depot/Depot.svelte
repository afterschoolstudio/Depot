<script>
import { createEventDispatcher } from 'svelte';
import {defaults} from './depotDefaults';
import DepotOptions from './DepotOptions.svelte';
import DepotTable from './DepotTable.svelte';
import DepotConfigurator from './DepotConfigurator.svelte';
import { v4 as uuidv4 } from 'uuid';
export let data;
let debug = false;

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
                    for (let index = 1; index <= event.detail.data.amount; index++) {
                        var newLine = {};
                        newLine["guid"] = uuidv4();
                        data.sheets[selectedSheet].columns.forEach(column => {
                            if(column.typeStr == "multiple")
                            {
                                newLine[column.name] = column.defaultValue.split(', ');
                            }
                            else
                            {
                                newLine[column.name] = column.defaultValue;
                            }
                        });
                        data.sheets[selectedSheet].lines.push(newLine);
                    }
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
                    //if you're creating a column, create a new entry for a column value in every line based off the default value
                    data.sheets[selectedSheet].lines.forEach(line => {
                        if(editorData.typeStr == "multiple")
                        {
                            line[editorData.name] = editorData.defaultValue.split(', ');
                        }
                        else
                        {
                            line[editorData.name] = editorData.defaultValue;
                        }
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
                    //update line entries depending on circumstances - maybe a faster way?
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
                    if(editorData.typeStr == "multiple")
                    {
                        data.sheets[selectedSheet].lines.forEach(line => {
                            //make sure the multiple only has values possible based on config
                            //this removes old values if config changes
                            line[editorData.name] = line[editorData.name].filter(value => editorData.options.includes(value));
                        });
                    }
                    if(editorData.typeStr == "enum")
                    {
                        data.sheets[selectedSheet].lines.forEach(line => {
                            //make sure the enum only has values possible based on config
                            if(!editorData.options.includes(line[editorData.name]))
                            {
                                line[editorData.name] = editorData.defaultValue
                            }
                        });
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
            break;
        case "editLine":
            switch (event.detail.data.operation) {
                case "remove":
                    data.sheets[selectedSheet].lines.splice(event.detail.data.lineIndex,1);
                    //TODO: need to update any sheets that reference this line?
                    break;
                default:
                    break;
            }
            sheetsUpdated();
            break;
        case "pickFile":
            //forward events from fields
            var fileKey = event.detail.fileKey;
            fileKey["sheet"] = selectedSheet;
            dispatch('message', {
                "type" : "pickFile",
                "fileKey" : event.detail.fileKey
            });
            break;
        default:
            break;
    }
}

</script>
 
<h1>Depot</h1>
{#if !data.hasOwnProperty("sheets")}
    <p>Invalid Depot File</p>
    <p>Use Ctrl/Cmd+Shift+P and select "Create new Depot File" to get started</p>
{:else}
    <DepotOptions bind:debug={debug} on:message={handleOptions} allDisabled={editorConfig.active} editSheetDisabled={data.sheets.length == 0} addLineDisabled={data.sheets.length == 0 || data.sheets[selectedSheet].columns.length == 0}/>
    {#if data.sheets.length === 0}
       <DepotConfigurator debug={debug} data={editorConfig.active ? editorData : {}} config={editorConfig} on:message={handleConfigUpdate}/>
    {:else}
        {#each data.sheets as sheet}
            <button on:click={focusSheet(data.sheets.indexOf(sheet))} disabled={editorConfig.active}>{sheet.name}</button>
        {/each}
        <DepotConfigurator debug={debug} data={editorConfig.active ? editorData : {}} config={editorConfig} on:message={handleConfigUpdate}/>
        {#if !editorConfig.active}
            <!-- hide the table if editing a field to prevent sending the sheetupdate -->
            <DepotTable debug={debug} bind:data={data.sheets[selectedSheet]} on:message={handleTableAction}/>
        {/if}
    {/if}
{/if}

{#if debug}
<p>Selected Sheet: {selectedSheet}</p>
<p>Raw Data:</p>
<pre>{JSON.stringify({data},null,2)}</pre>
{/if}
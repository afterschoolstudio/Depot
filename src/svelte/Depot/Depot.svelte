<script>
import { createEventDispatcher } from 'svelte';
import {defaults} from './depotDefaults';
import DepotOptions from './DepotOptions.svelte';
import DepotSheet from './DepotSheet.svelte';
import DepotConfigurator from './DepotConfigurator.svelte';
import { v4 as uuidv4 } from 'uuid';
export let data;
let debug = false;
let showLineGUIDs = false;

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

function getBannedNames(referenceSheetGUID, config) {
    var sheetNames = [];
    for(var o in data.sheets) {
        if(config.operation === "new" || 
          (config.operation === "edit" && referenceSheetGUID in data.sheets && (data.sheets[o].name !== data.sheets[data.sheets.indexOf(sheet => sheet.guid === referenceSheetGUID)].name)))
        {
            //this means its the currently open sheet, we dont add our name to the banned list, only others
            sheetNames.push(data.sheets[o].name);
        }
    }
    var columnNames = [];
    if(data.sheets.length > 0)
    {
        var sheetIndex = data.sheets.findIndex(sheet => sheet.guid === referenceSheetGUID);
        if (sheetIndex >= 0 && data.sheets[sheetIndex].columns.length !== 0) {
            for(var o in data.sheets[sheetIndex].columns) {
                if(config.operation === "new" || 
                  (config.operation === "edit" && (data.sheets[sheetIndex].columns[o].name !== config.editType)))
                {
                    //this means its the currently open column, we dont add our name to the banned list, only others
                    columnNames.push(data.sheets[sheetIndex].columns[o].name);
                }
            }
        }
    }
    return { "sheetNames" : sheetNames, "columnNames" : columnNames}
}

let depotFileInfo = {};
$: {
    var sheetNames = [];
    var sheetGuids = [];
    var sheetNamesFiltered = [];
    var sheetGuidsFiltered = [];
    var lines = {};
    var columns = {};
    data.sheets.forEach(sheet => {
        sheetNames.push(sheet.name);
        sheetGuids.push(sheet.guid);
        if(!sheet.hidden)
        {
            sheetNamesFiltered.push(sheet.name);
            sheetGuidsFiltered.push(sheet.guid);
        }
        lines[sheet.guid] = { "names": [], "ids": [], "guids" : []};
        columns[sheet.guid] = { "names": [], "guids" : []};
        sheet.lines.forEach(line => {
            lines[sheet.guid].names.push(line[sheet.displayColumn])
            lines[sheet.guid].ids.push(line.id)
            lines[sheet.guid].guids.push(line.guid)
        });
        sheet.columns.forEach(column => {
            columns[sheet.guid].names.push(column.name)
            columns[sheet.guid].guids.push(column.guid)
        });
        columns[sheet.guid].names.push("id");
        columns[sheet.guid].names.push("guid");
    });
    depotFileInfo = {"sheets" : {
                    "names":sheetNames,
                    "guids":sheetGuids,
                    },
                "sheetsFiltered" : {
                    "names":sheetNamesFiltered,
                    "guids":sheetGuidsFiltered,
                    },
                "lines" : lines,
                "columns" : columns,
                };
}

function createLines(sheetGUID, amount) {
    let sheetIndex = data.sheets.findIndex(sheet => sheet.guid === sheetGUID);
    for (let index = 1; index <= amount; index++) {
        var newLine = {};
        newLine["guid"] = uuidv4();
        newLine["id"] = data.sheets[sheetIndex].lines.length + "";
        data.sheets[sheetIndex].columns.forEach(column => {
            if(column.typeStr == "multiple")
            {
                newLine[column.name] = column.defaultValue.split(', ');
            }
            else
            {
                newLine[column.name] = column.defaultValue;
            }
        });
        data.sheets[sheetIndex].lines.push(newLine);
    }
    sheetsUpdated();
}

function handleConfigUpdate(event) {
    switch (event.detail.type) {
        case "create":
            switch (editorConfig.editType) {
                case "sheet":
                    data.sheets.push(editorData);
                    selectedSheet = data.sheets.length - 1;
                    editorConfig = {"active":false};
                    createLines(editorData.guid,1); //calls sheets updated as well
                    break;
                default: //column
                    let sheetIndex = data.sheets.findIndex(sheet => sheet.guid === editorConfig.sheetGUID);
                    data.sheets[sheetIndex].columns.push(editorData);
                    //if you're creating a column, create a new entry for a column value in every line based off the default value
                    data.sheets[sheetIndex].lines.forEach(line => {
                        if(editorData.typeStr === "multiple")
                        {
                            line[editorData.name] = editorData.defaultValue.split(', ');
                        }
                        else
                        {
                            line[editorData.name] = editorData.defaultValue;
                        }
                    });
                    if(editorData.typeStr === "list") {
                        // make a new sheet that this list will reference
                        let newList = JSON.parse(JSON.stringify(defaults["sheet"]));
                        newList["hidden"] = true;
                        newList["description"] = "list@"+data.sheets[sheetIndex].guid;
                        let guid = uuidv4();
                        newList["guid"] = guid;
                        data.sheets[sheetIndex].columns[data.sheets[sheetIndex].columns.findIndex(col => col.guid === editorData.guid)].sheet = guid;
                        newList["name"] = editorData.name; //worth noting that invisible sheet names are also checked against for name creation
                        delete newList.configurable.displayColumn;
                        data.sheets.push(newList);
                    }
                    editorConfig = {"active":false};
                    sheetsUpdated();
                    break;
            }
            break;
        case "save":
            switch (editorConfig.editType) {
                case "sheet":
                    data.sheets[selectedSheet] = editorData;
                    break;
                default: //column
                    let sheetIndex = data.sheets.findIndex(sheet => sheet.guid === editorConfig.sheetGUID);
                    var index = data.sheets[sheetIndex].columns.findIndex(x => x.name === editorConfig.editType); //old name
                    data.sheets[sheetIndex].columns[index] = editorData; //column now has new name maybe
                    //update line entries depending on circumstances - maybe a faster way?
                    if(editorConfig.editType !== editorData.name)
                    {
                        data.sheets[sheetIndex].lines.forEach(line => {
                            //assing the new key the old value
                            line[editorData.name] = line[editorConfig.editType];
                            //delete the old entry
                            delete line[editorConfig.editType];
                        });
                        //TODO: may need to do more here if column name change was referenced by other sheet?
                    }
                    if(editorData.typeStr == "multiple")
                    {
                        data.sheets[sheetIndex].lines.forEach(line => {
                            //make sure the multiple only has values possible based on config
                            //this removes old values if config changes
                            line[editorData.name] = line[editorData.name].filter(value => editorData.options.includes(value));
                        });
                    }
                    if(editorData.typeStr == "enum")
                    {
                        data.sheets[sheetIndex].lines.forEach(line => {
                            //make sure the enum only has values possible based on config
                            if(!editorData.options.includes(line[editorData.name]))
                            {
                                line[editorData.name] = editorData.defaultValue
                            }
                        });
                    }
                    if(editorData.typeStr == "list")
                    {
                        let refIndex = data.sheets.findIndex(s => s.guid === editorData.sheet);
                        data.sheets[refIndex].name = editorData.name;
                    }
                    
                    break;
            }
            editorConfig = {"active":false};
            sheetsUpdated();
            break;
        case "delete":
            switch (editorConfig.editType) {
                case "sheet":
                    const deletedGUID = data.sheets[selectedSheet].guid;
                    //recursively delete any list fields on this sheet
                    data.sheets[selectedSheet].columns.forEach(column => {
                        if(column.typeStr === "list") {
                            deleteListColumn(column);
                        }
                    });
                    data.sheets.splice(selectedSheet,1);
                    if(selectedSheet >= data.sheets.length)
                    {
                        selectedSheet = selectedSheet - 1 < 0 ? 0 : selectedSheet - 1;
                    }
                    //delete any references to this and set to ""
                    data.sheets.forEach(sheet => {
                        var sheetRefColumns = sheet.columns.filter(column => column.typeStr === "sheetReference");
                        var lineRefColumns = sheet.columns.filter(column => column.typeStr === "lineReference");
                        if(sheetRefColumns.length > 0) {
                            sheet.lines.forEach(line => {
                                sheetRefColumns.forEach(column => {
                                    if(line[column.name] === deletedGUID)
                                    {
                                        line[column.name] = "";
                                    }
                                });
                            });
                            sheetRefColumns.forEach(column => {
                                if(column.defaultValue === deletedGUID)
                                {
                                    column.defaultValue = "";
                                }
                            });
                        }
                        if(lineRefColumns.length > 0) {
                            let editedColumns = [];
                            lineRefColumns.forEach(column => {
                                if(column.sheet === deletedGUID)
                                {
                                    column.sheet = "";
                                    column.defaultValue = "";
                                    editedColumns.push(column);
                                }
                            });
                            sheet.lines.forEach(line => {
                                editedColumns.forEach(column => {
                                    //clear out previous linked values, as they pointed to a now deleted sheet
                                    line[column.name] = "";
                                });
                            });
                        }
                    });
                    break;
                default: //column
                    let sheetIndex = data.sheets.findIndex(sheet => sheet.guid === editorConfig.sheetGUID);
                    var index = data.sheets[sheetIndex].columns.findIndex(x => x.name === editorConfig.editType); //old name
                    data.sheets[sheetIndex].lines.forEach(line => {
                        //delete the entry for this column
                        delete line[editorConfig.editType];
                    });
                    if(data.sheets[sheetIndex].displayColumn === data.sheets[sheetIndex].columns[index].name)
                    {
                        //we deleted the display column, update to default
                        data.sheets[sheetIndex].displayColumn = defaults["sheet"].displayColumn;
                    }
                    if(data.sheets[sheetIndex].columns[index].typeStr === "list")
                    {
                        deleteListColumn(data.sheets[sheetIndex].columns[index]);
                    }
                    //delete the column
                    data.sheets[sheetIndex].columns.splice(index,1);
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

function deleteListColumn(col) {
    let delSheetIndex = data.sheets.findIndex(sheet => sheet.guid === col.sheet);
    data.sheets[delSheetIndex].columns.forEach(column => {
        if(column.typeStr === "list") {
            deleteListColumn(column);
        }
    });
    data.sheets.splice(delSheetIndex,1);
}

let editorConfig = {"active" : false}
let editorData = {}
function handleTableAction(event) {
    let sheetIndex = data.sheets.findIndex(sheet => sheet.guid === event.detail.data.sheetGUID);
    switch (event.detail.type) {
        case "editorUpdate":
            editorConfig = event.detail.data;
            editorConfig["bannedNames"] = getBannedNames(event.detail.data.sheetGUID,editorConfig);
            editorConfig["depotInfo"] = depotFileInfo;
            switch (event.detail.data.operation) {
                case "new":
                    editorData = JSON.parse(JSON.stringify(defaults[editorConfig.editType]));
                    editorData["guid"] = uuidv4(); //assign columns and sheets guids
                    if(event.detail.data.editType === "lineReference")
                    {
                        //not sure why enum value not setting to default in the configurator, so set a default here
                        let defSheet = data.sheets.find(s => s.hidden !== true).guid; //get first unhidden sheet
                        editorData["sheet"] = defSheet;
                    }
                    break;
                case "edit":
                    switch (event.detail.data.editType) {
                        case "sheet":
                            editorData = JSON.parse(JSON.stringify(data.sheets[sheetIndex]));
                            break;
                        default: //column
                            editorData = JSON.parse(JSON.stringify(data.sheets[sheetIndex].columns.find(x => x.name === editorConfig.editType)));
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;
        case "update":
            sheetsUpdated();
            break;
        case "lineEdit":
            switch (event.detail.data.operation) {
                case "remove":
                    const deletedGUID = event.detail.data.line.guid;
                    data.sheets[sheetIndex].lines.splice(event.detail.data.lineIndex,1);
                    data.sheets.forEach(sheet => {
                        var lineRefColumns = sheet.columns.filter(column => column.typeStr === "lineReference");
                        if(lineRefColumns.length > 0) {
                            sheet.lines.forEach(line => {
                                lineRefColumns.forEach(column => {
                                    if(line[column.name] === deletedGUID)
                                    {
                                        line[column.name] = "";
                                    }
                                });
                            });
                            lineRefColumns.forEach(column => {
                                if(column.defaultValue === deletedGUID)
                                {
                                    column.defaultValue = "";
                                }
                            });
                        }
                    });
                    break;
                case "add":
                    if(!data.sheets[sheetIndex].hidden) {
                        createLines(event.detail.data.sheetGUID,event.detail.data.amount);
                    }
                    else {
                        //lines added in through hidden sheets are added as data values on the line entry at the column value
                        //TODO:
                    }
                break;
                default:
                    break;
            }
            sheetsUpdated();
            break;
        case "pickFile":
            //forward events from fields
            var fileKey = event.detail.fileKey;
            fileKey["sheet"] = sheetIndex;
            dispatch('message', {
                "type" : "pickFile",
                "fileKey" : event.detail.fileKey
            });
            break;
        default:
            break;
    }
}
function createSheet() {
    editorConfig = {
        "active" : true,
        "operation" : "new",
        "editType" : "sheet",
    }
    editorData = JSON.parse(JSON.stringify(defaults[editorConfig.editType]));
    let sheetGUID = uuidv4();
    editorData["guid"] = sheetGUID; //assign columns and sheets guids
    editorConfig["bannedNames"] = getBannedNames(sheetGUID,editorConfig);
    editorConfig["depotInfo"] = depotFileInfo;
}

</script>
<h1>Depot</h1>
{#if !data.hasOwnProperty("sheets")}
    <p>Invalid Depot File</p>
    <p>Use Ctrl/Cmd+Shift+P and select "Create new Depot File" to get started</p>
{:else}
    <DepotOptions bind:debug={debug} bind:showLineGUIDs={showLineGUIDs}/>
    {#if data.sheets.length === 0}
       <DepotConfigurator debug={debug} data={editorConfig.active ? editorData : {}} config={editorConfig} on:message={handleConfigUpdate}/>
       <button on:click={createSheet} disabled={editorConfig.active}>New Sheet</button>
    {:else}
        {#each data.sheets as sheet}
            {#if !sheet.hidden}
            <button on:click={focusSheet(data.sheets.indexOf(sheet))} disabled={editorConfig.active}>{sheet.name}</button>
            {/if}
        {/each}
        <button on:click={createSheet} disabled={editorConfig.active}>+</button> 
        <DepotConfigurator debug={debug} data={editorConfig.active ? editorData : {}} config={editorConfig} on:message={handleConfigUpdate}/>
        {#if !editorConfig.active}
            <!-- hide the table if editing a field to prevent sending the sheetupdate -->
            <DepotSheet debug={debug} 
                        showLineGUIDs={showLineGUIDs} 
                        bind:fullData={data} 
                        bind:sheetData={data.sheets[selectedSheet]} 
                        bind:lineData={data.sheets[selectedSheet].lines} 
                        depotInfo={depotFileInfo} 
                        on:message={handleTableAction}/>
        {/if}
    {/if}
{/if}

{#if debug}
<p>Selected Sheet: {selectedSheet}</p>
<p>Raw Data:</p>
<pre>{JSON.stringify({data},null,2)}</pre>
{/if}
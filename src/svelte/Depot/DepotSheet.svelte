<script>
import { getContext } from 'svelte';
import TextField from "../Fields/TextField.svelte";
import BooleanField from '../Fields/BooleanField.svelte';
import EnumField from '../Fields/EnumField.svelte';
import ImageField from '../Fields/ImageField.svelte';
import LongTextField from '../Fields/LongTextField.svelte';
import MultipleField from '../Fields/MultipleField.svelte';
import NumberField from '../Fields/NumberField.svelte';
import {defaults} from './depotDefaults';
import { v4 as uuidv4 } from 'uuid';

import { createEventDispatcher } from 'svelte';
export let fullData;
export let sheetData;
export let lineData;
export let debug;
export let showLineGUIDs;
export let depotInfo;
export let originLineGUID = "";
export let listVisibility = {};
const dispatch = createEventDispatcher();
let iconPaths = getContext("iconPaths");

function editColumn(column) {
    dispatch('message', {
        "type" : "editorUpdate",
        "data" : {
            "active" : true,
            "operation" : "edit",
            "editType" : column,
            "sheetGUID" : sheetData.guid
        }
    });
}

function removeLine(lineIndex, line, originGUID) {
    dispatch('message', {
        "type" : "lineEdit",
        "data" : {
            "operation" : "remove",
            "lineIndex" : lineIndex,
            "line" : line,
            "originLineGUID" : originGUID,
            "sheetGUID" : sheetData.guid
        }
    });
}

function addLines(amount,originGUID) {
    dispatch('message', {
        "type" : "lineEdit",
        "data" : {
            "operation" : "add",
            "amount" : amount,
            "originLineGUID" : originGUID,
            "sheetGUID" : sheetData.guid
        }
    });
}

function createColumn(columnType) {
    dispatch('message', {
        "type" : "editorUpdate",
        "data" :{
                "active" : true,
                "operation" : "new",
                "editType" : columnType,
                "sheetGUID" : sheetData.guid
                }
    });
}

function editSheet() {
    dispatch('message', {
        "type" : "editorUpdate",
        "data" :{
                "active" : true,
                "operation" : "edit",
                "editType" : "sheet",
                "sheetGUID" : sheetData.guid
                }
    });
}

function handleSubTableEvent(event) {
    console.log("handing subtable event");
    console.log(event);
    console.log(originLineGUID)
    switch (event.detail.type) {
        case "lineEdit":
            let nestedSheetGUID = event.detail.data.sheetGUID;
            let nestedSheetIndex = fullData.sheets.findIndex(sheet => sheet.guid === nestedSheetGUID);
            //this is the line in the parent sheet that caught the event from the subsheet
            var refLineIndex = lineData.findIndex(line => line.guid === event.detail.data.originLineGUID);
            var refLineColumn = listVisibility[event.detail.data.originLineGUID];
            switch (event.detail.data.operation) {
                case "add":
                    console.log("adding nested line from",nestedSheetGUID,"with index",nestedSheetIndex,"from line",originLineGUID,"with index",refLineIndex,"at column",refLineColumn.name,"with guid",refLineColumn.guid)
                    for (let index = 1; index <= event.detail.data.amount; index++) {
                        var newLine = {};
                        newLine["guid"] = uuidv4();
                        newLine["id"] = lineData[refLineIndex][refLineColumn.name].length + "";
                        fullData.sheets[nestedSheetIndex].columns.forEach(column => {
                            if(column.typeStr == "multiple")
                            {
                                newLine[column.name] = column.defaultValue.split(', ');
                            }
                            else
                            {
                                newLine[column.name] = column.defaultValue;
                            }
                        });
                        lineData[refLineIndex][refLineColumn.name].push(newLine);
                    }
                    break;
                case "remove":
                    lineData[refLineIndex][refLineColumn.name].splice(event.detail.data.lineIndex,1);
                    //delete this from visibility
                    //TODO: if the line has nested lists as well that are visbile, this needs to delete those lines as well from visbility
                    //this doesn't happen right now so creates some garbage in listVisibility
                    if(lineData[refLineIndex].guid in listVisibility)
                    {
                        delete listVisibility[refLineIndex];
                    }
                    //nested sheet lines cannot be referened so we can just delete this from the list
                    break;
                default:
                    break;
            }
            //push updates
            dispatch('message', {
                "type" : "update",
                "data" : {
                    "sheetGUID" : nestedSheetGUID
                }
            });
            break;
        default:
            //forward messages otherwise from nested table
            dispatch('message',event.detail);
            break;
    }
}

let totalColumns = 0;
$: {
    console.log(sheetData);
    if(showLineGUIDs)
    {
        totalColumns = sheetData.columns.length + 3;
    }
    else
    {
        totalColumns = sheetData.columns.length + 2; 
    }
} 


function setListVisible(line,column,visible) {
    if(visible) {
        listVisibility[line.guid] = column;
    }
    else {
        delete listVisibility[line.guid];
    }
    //https://svelte.dev/tutorial/updating-arrays-and-objects
    listVisibility = listVisibility;
}

function validateID(event,line) {
    switch (event.detail.type) {
        case "validate":
            lineData.forEach(ld => {
                if(line.guid !== ld.guid && line.id === ld.id)
                {
                   let index = lineData.findIndex(l => l.guid === line.guid);
                   lineData[index].id = "DUPLICATE("+line.id+")";
                }
            });
            dispatch('message', {
                "type" : "update",
                "data" : {
                    "sheetGUID" : sheetData.guid
                }
            });
            break;
        default:
            //forward messages otherwise from nested table
            dispatch('message',event.detail);
            break;
    }
}

</script>
    <table>
    <tr>
        <td colspan="{totalColumns}">
            {#if !sheetData.hidden}
                <button class="buttonIcon padded" on:click={editSheet}>
                    <img src={iconPaths["editSheet"].path} alt="Edit Sheet">
                </button>
            {/if}
            {#each Object.keys(defaults) as columnType}
                {#if columnType !== "sheet"}
                <button class="buttonIcon padded" on:click={() => createColumn(columnType)}>
                    <img src={iconPaths[defaults[columnType].iconName].path} alt="Create new {columnType} column">
                </button>
                {/if}
            {/each}
        </td>
    </tr>
    <tr>
        <th style="width:17px;">    </th>
        {#if showLineGUIDs}
        <th>GUID</th>
        {/if}
        <th>ID</th>
        {#each sheetData.columns as column}
            <th title="{column.description}"><a href={"#"} on:click={()=> editColumn(column.name)}>{column.name}</a></th>
        {/each}
    </tr>
    {#each lineData as line, i}
        <tr>
            <td style="width:17px;">
            <button class="buttonIcon" on:click={() => removeLine(i,line,originLineGUID)}>
                <img src={iconPaths["removeLine"].path} alt="Remove Line">
            </button>
            </td>
            {#if showLineGUIDs}
            <td>{line.guid}</td>
            {/if}
            <td><TextField sheetGUID={sheetData.guid} bind:data={line["id"]} on:message={(event) => validateID(event,line)}/></td>
            {#each sheetData.columns as column, c}
                <td title="{column.description}">
                <div>
                <!-- message from field updates bubble to Depot.svelte -->
                {#if column.typeStr === "text"}
                <TextField sheetGUID={sheetData.guid} bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "longtext"}
                <LongTextField sheetGUID={sheetData.guid} bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "image"}
                <ImageField sheetGUID={sheetData.guid} bind:data={line[column.name]} on:message fileKey={{"line":line,"lineIndex":i,"column":column,"columnIndex":c}}/>
                {:else if column.typeStr === "bool"}
                <BooleanField sheetGUID={sheetData.guid} bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "enum"}
                <EnumField sheetGUID={sheetData.guid} bind:data={line[column.name]} options={sheetData.columns.find(x => x.name === column.name).options.split(', ')} on:message/>
                {:else if column.typeStr === "sheetReference"}
                <EnumField sheetGUID={sheetData.guid} bind:data={line[column.name]} options={depotInfo.sheetsFiltered.guids} aliases={depotInfo.sheetsFiltered.names} on:message/>
                {:else if column.typeStr === "lineReference"}
                    {#if column.sheet !== ""}
                    <EnumField sheetGUID={sheetData.guid} bind:data={line[column.name]} 
                                options={depotInfo.lines[column.sheet].guids} 
                                aliases={depotInfo.lines[column.sheet].names} on:message/>
                    {:else}
                    <EnumField sheetGUID={sheetData.guid} bind:data={line[column.name]} 
                                options={[]} 
                                aliases={[]} on:message/>
                    {/if}
                    {#if line[column.name] !== "" && !depotInfo.lines[column.sheet].guids.includes(line[column.name])}
                        <div title="Selected value with GUID {line[column.name]} not in selected sheet. Select proper sheet in column settings">ERROR</div>
                    {/if}
                {:else if column.typeStr === "multiple"}
                <MultipleField sheetGUID={sheetData.guid} bind:data={line[column.name]} options={sheetData.columns.find(x => x.name === column.name).options.split(', ')} on:message/>
                {:else if column.typeStr === "int" || column.typeStr === "float"}
                <NumberField sheetGUID={sheetData.guid} bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "list"}
                    {#if line.guid in listVisibility && listVisibility[line.guid].guid === column.guid}
                        <button class="buttonIcon" on:click={()=>setListVisible(line,column,false)}>
                            <img src={iconPaths["showList"].path} alt="Hide list">
                        </button>
                    {:else}
                        <button class="buttonIcon" on:click={()=>setListVisible(line,column,true)}>
                            <img src={iconPaths["hideList"].path} alt="Show list">
                        </button>
                    {/if}
                {/if}
                </div>
                </td>
            {/each}
        </tr>
        {#if line.guid in listVisibility}
        <!-- maybe pull this out of the tr and just use a div? -->
        <tr>
            <td></td>
            <td colspan="{totalColumns -  1}">
                <!--    lineData grabs itself from the values in the lineData in this sheet
                        this is because lines store their nested values inside of themsevles instead of inside the sheet -->
                <svelte:self    debug={debug} 
                                showLineGUIDs={showLineGUIDs} 
                                originLineGUID={line.guid}
                                bind:fullData={fullData} 
                                bind:sheetData={fullData.sheets[fullData.sheets.findIndex(sheet => sheet.guid === listVisibility[line.guid].sheet)]} 
                                bind:lineData={lineData[lineData.findIndex(refLine => refLine.guid === line.guid)] 
                                                       [listVisibility[line.guid].name]} 
                                depotInfo={depotInfo} 
                                on:message={handleSubTableEvent}
                                bind:listVisibility={listVisibility}/>
            </td>
        </tr>
        {/if}
    {/each}
    <tr>
        <td></td>
        <td colspan="{totalColumns -  1}">
            <button class="buttonIcon padded" on:click={() => addLines(1,originLineGUID)}>
                <img src={iconPaths["addOneLine"].path} alt="Add one line" width="40" height="40">
            </button>
            <button class="buttonIcon padded" on:click={() => addLines(5,originLineGUID)}>
                <img src={iconPaths["addFiveLines"].path} alt="Add five lines" width="40" height="40">
            </button>
            <button class="buttonIcon padded" on:click={() => addLines(10,originLineGUID)}>
                <img src={iconPaths["addTenLines"].path} alt="Add ten lines" width="40" height="40">
            </button>
        </td>
    </tr>
    </table>
{#if debug}
<p>Current Table Data:</p>
<pre>{JSON.stringify({sheetData},null,2)}</pre>
<p>----------------------------------------</p>
{/if}

<style>
    .buttonIcon {
        background-color: #3A3A3A;
        border: none;
        color: white;
        display: inline-block;
        cursor: pointer;
    }
    .buttonIcon:hover {
        background-color: #2A2D2E;
    }
    .buttonIcon:focus {
        outline: none;
        box-shadow: none;
    }
    .buttonIcon:active:focus {
        outline: none;
        box-shadow: none;
    }
    .buttonIcon.padded {
        margin: 5px 5px 5px 0px;
        width: 45px;
        height: 45px;
    }
</style>
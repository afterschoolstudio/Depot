<script>
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
export let debug;
export let showLineGUIDs;
export let depotInfo;
export let originLineGUID = "";
const dispatch = createEventDispatcher();

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

function removeLine(lineIndex, line) {
    dispatch('message', {
        "type" : "lineEdit",
        "data" : {
            "operation" : "remove",
            "lineIndex" : lineIndex,
            "line" : line,
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
            var refLineIndex = sheetData.lines.findIndex(line => line.guid === event.detail.data.originLineGUID);
            var refLineColumn = listVisibility[event.detail.data.originLineGUID];
            switch (event.detail.data.operation) {
                case "add":
                    console.log("adding nested line from",nestedSheetGUID,"with index",nestedSheetIndex,"from line",originLineGUID,"with index",refLineIndex,"at column",refLineColumn.name,"with guid",refLineColumn.guid)
                    for (let index = 1; index <= event.detail.data.amount; index++) {
                        var newLine = {};
                        newLine["guid"] = uuidv4();
                        newLine["id"] = sheetData.lines[refLineIndex][refLineColumn.name].length + "";
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
                        sheetData.lines[refLineIndex][refLineColumn.name].push(newLine);
                    }
                    break;
                case "delete":
                    
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
            dispatch('message',event.detail);
            break;
    }
}

$: totalColumns = showLineGUIDs ? sheetData.columns.length + 3 : sheetData.columns.length + 2;

let listVisibility = {};

function setListVisible(line,column,visible) {
    //set the context here? 
    if(visible) {
        listVisibility[line.guid] = column;
    }
    else {
        delete listVisibility[line.guid];
        //https://svelte.dev/tutorial/updating-arrays-and-objects
        listVisibility = listVisibility;
    }
}

</script>

    <table>
    <tr>
        <td colspan="{totalColumns}">
            {#if !sheetData.hidden}
                <button on:click={editSheet}>Edit Sheet</button>
            {/if}
            {#each Object.keys(defaults) as columnType}
                {#if columnType !== "sheet"}
                    <button on:click={() => createColumn(columnType)}>New {columnType}</button>
                {/if}
            {/each}
        </td>
    </tr>
    <tr>
        <th style="width:10px;">    </th>
        {#if showLineGUIDs}
            <th>GUID</th>
        {/if}
        <th>ID</th>
        {#each sheetData.columns as column}
            <th title="{column.description}"><a href={"#"} on:click={()=> editColumn(column.name)}>{column.name}</a></th>
        {/each}
    </tr>
    {#each sheetData.lines as line, i}
        <tr>
            <td><button on:click={() => removeLine(i,line)}>X</button></td>
            {#if showLineGUIDs}
            <td>{line.guid}</td>
            {/if}
            <td><TextField bind:data={line["id"]} on:message/></td>
            {#each sheetData.columns as column, c}
                <td title="{column.description}">
                <div>
                <!-- message from field updates bubble to Depot.svelte -->
                {#if column.typeStr === "text"}
                <TextField bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "longtext"}
                <LongTextField bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "image"}
                <ImageField bind:data={line[column.name]} on:message fileKey={{"line":line,"lineIndex":i,"column":column,"columnIndex":c}}/>
                {:else if column.typeStr === "bool"}
                <BooleanField bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "enum"}
                <EnumField bind:data={line[column.name]} options={sheetData.columns.find(x => x.name === column.name).options.split(', ')} on:message/>
                {:else if column.typeStr === "sheetReference"}
                <EnumField bind:data={line[column.name]} options={depotInfo.sheetsFiltered.guids} aliases={depotInfo.sheetsFiltered.names} on:message/>
                {:else if column.typeStr === "lineReference"}
                    {#if column.sheet !== ""}
                    <EnumField bind:data={line[column.name]} 
                                options={depotInfo.lines[column.sheet].guids} 
                                aliases={depotInfo.lines[column.sheet].names} on:message/>
                    {:else}
                    <EnumField bind:data={line[column.name]} 
                                options={[]} 
                                aliases={[]} on:message/>
                    {/if}
                    {#if line[column.name] !== "" && !depotInfo.lines[column.sheet].guids.includes(line[column.name])}
                        <div title="Selected value with GUID {line[column.name]} not in selected sheet. Select proper sheet in column settings">ERROR</div>
                    {/if}
                {:else if column.typeStr === "multiple"}
                <MultipleField bind:data={line[column.name]} options={sheetData.columns.find(x => x.name === column.name).options.split(', ')} on:message/>
                {:else if column.typeStr === "int" || column.typeStr === "float"}
                <NumberField bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "list"}
                    {#if line.guid in listVisibility && listVisibility[line.guid].guid === column.guid}
                        <button on:click={()=>setListVisible(line,column,false)}>Hide</button>
                    {:else}
                        <button on:click={()=>setListVisible(line,column,true)}>Show</button>
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
                <svelte:self    debug={debug} 
                                showLineGUIDs={showLineGUIDs} 
                                originLineGUID={line.guid}
                                bind:fullData={fullData} 
                                bind:sheetData={fullData.sheets[fullData.sheets.findIndex(sheet => sheet.guid === listVisibility[line.guid].sheet)]} 
                                depotInfo={depotInfo} 
                                on:message={handleSubTableEvent}/>
            </td>
        </tr>
        {/if}
    {/each}
    <tr>
        <td></td>
        <td colspan="{totalColumns -  1}">
            <button on:click={() => addLines(1,originLineGUID)}>New Line</button>
            <button on:click={() => addLines(5,originLineGUID)}>New Line x5</button>
            <button on:click={() => addLines(10,originLineGUID)}>New Line x20</button>
        </td>
    </tr>
    </table>
{#if debug}
<p>Current Table Data:</p>
<pre>{JSON.stringify({sheetData},null,2)}</pre>
<p>----------------------------------------</p>
{/if}
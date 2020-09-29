<script>
import TextField from "../Fields/TextField.svelte";
import BooleanField from '../Fields/BooleanField.svelte';
import EnumField from '../Fields/EnumField.svelte';
import ImageField from '../Fields/ImageField.svelte';
import LongTextField from '../Fields/LongTextField.svelte';
import MultipleField from '../Fields/MultipleField.svelte';
import NumberField from '../Fields/NumberField.svelte';
import {defaults} from './depotDefaults';

import { createEventDispatcher } from 'svelte';
export let fullData;
export let data;
export let debug;
export let showLineGUIDs;
export let tableInfo;
const dispatch = createEventDispatcher();

function editColumn(column) {
    dispatch('message', {
        "type" : "editorUpdate",
        "data" : {
            "active" : true,
            "operation" : "edit",
            "editType" : column,
            "sheetGUID" : data.guid
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
            "sheetGUID" : data.guid
        }
    });
}

function addLines(amount) {
    dispatch('message', {
        "type" : "lineEdit",
        "data" : {
            "operation" : "add",
            "amount" : amount,
            "sheetGUID" : data.guid
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
                "sheetGUID" : data.guid
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
                "sheetGUID" : data.guid
                }
    });
}

$: totalColumns = showLineGUIDs ? data.columns.length + 3 : data.columns.length + 2;

let listVisibility = {};
$: {
    // data.lines.forEach(line => {
    //     //get context here?
    //     listVisibility = {};
    //     data.columns.forEach(col => {
    //         if(col.typeStr === "list")
    //         {
    //             listVisibility[line.guid] = {
    //                 [col.guid] : false
    //             }
    //             listVisibility[line.guid]["visible"] = false;
    //             listVisibility[line.guid]["column"] = "";
    //         }
    //     });
    // });
}

function setListVisible(line,column,visible) {
    //set the context here? 
    if(visible) {
        listVisibility[line.guid] = {
            "colName" : column.name,
            "colGuid" : column.guid,
            "colSheetGuid" : column.sheet,
        }
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
            {#if !data.hidden}
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
        {#each data.columns as column}
            <th title="{column.description}"><a href={"#"} on:click={()=> editColumn(column.name)}>{column.name}</a></th>
        {/each}
    </tr>
    {#each data.lines as line, i}
        <tr>
            <td><button on:click={() => removeLine(i,line)}>X</button></td>
            {#if showLineGUIDs}
            <td>{line.guid}</td>
            {/if}
            <td><TextField bind:data={line["id"]} on:message/></td>
            {#each data.columns as column, c}
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
                <EnumField bind:data={line[column.name]} options={data.columns.find(x => x.name === column.name).options.split(', ')} on:message/>
                {:else if column.typeStr === "sheetReference"}
                <EnumField bind:data={line[column.name]} options={tableInfo.sheetsFiltered.guids} aliases={tableInfo.sheetsFiltered.names} on:message/>
                {:else if column.typeStr === "lineReference"}
                    {#if column.sheet !== ""}
                    <EnumField bind:data={line[column.name]} 
                                options={tableInfo.lines[column.sheet].guids} 
                                aliases={tableInfo.lines[column.sheet].names} on:message/>
                    {:else}
                    <EnumField bind:data={line[column.name]} 
                                options={[]} 
                                aliases={[]} on:message/>
                    {/if}
                    {#if line[column.name] !== "" && !tableInfo.lines[column.sheet].guids.includes(line[column.name])}
                        <div title="Selected value with GUID {line[column.name]} not in selected sheet. Select proper sheet in column settings">ERROR</div>
                    {/if}
                {:else if column.typeStr === "multiple"}
                <MultipleField bind:data={line[column.name]} options={data.columns.find(x => x.name === column.name).options.split(', ')} on:message/>
                {:else if column.typeStr === "int" || column.typeStr === "float"}
                <NumberField bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "list"}
                    {#if line.guid in listVisibility && listVisibility[line.guid].colGuid === column.guid}
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
                                bind:fullData={fullData} 
                                bind:data={fullData.sheets[fullData.sheets.findIndex(sheet => sheet.guid === listVisibility[line.guid].colSheetGuid)]} 
                                tableInfo={tableInfo} 
                                on:message/>
            </td>
        </tr>
        {/if}
    {/each}
    <tr>
        <td></td>
        <td colspan="{totalColumns -  1}">
            <button on:click={() => addLines(1)}>New Line</button>
            <button on:click={() => addLines(5)}>New Line x5</button>
            <button on:click={() => addLines(10)}>New Line x20</button>
        </td>
    </tr>
    </table>
{#if debug}
<p>Current Table Data:</p>
<pre>{JSON.stringify({data},null,2)}</pre>
<p>----------------------------------------</p>
{/if}
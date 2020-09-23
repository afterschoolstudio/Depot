<script>
import TextField from "../Fields/TextField.svelte";
import BooleanField from '../Fields/BooleanField.svelte';
import EnumField from '../Fields/EnumField.svelte';
import ImageField from '../Fields/ImageField.svelte';
import LongTextField from '../Fields/LongTextField.svelte';
import MultipleField from '../Fields/MultipleField.svelte';
import NumberField from '../Fields/NumberField.svelte';

import { createEventDispatcher } from 'svelte';
export let data;
export let debug;
const dispatch = createEventDispatcher();

function editColumn(column) {
    dispatch('message', {
        "type" : "editorUpdate",
        "data" : {
            "active" : true,
            "operation" : "edit",
            "editType" : column
        }
    });
}

function removeLine(lineIndex, line) {
    dispatch('message', {
        "type" : "editLine",
        "data" : {
            "operation" : "remove",
            "lineIndex" : lineIndex,
            "line" : line
        }
    });
}

</script>

<br>
{#if data.columns.length === 0}
    <p>No columns</p>
{:else}
    <table>
    <tr>
        <th style="width:10px;">    </th>
        <th style="width:10px;">GUID</th>
        {#each data.columns as column}
            <th title="{column.description}"><a href={"#"} on:click={()=> editColumn(column.name)}>{column.name}</a></th>
        {/each}
    </tr>
    {#each data.lines as line, i}
        <tr>
            <td><button on:click={() => removeLine(i,line)}>X</button></td>
            <td title="{line.guid}">...</td>
            {#each data.columns as column}
                <td title="{column.description}">
                <div>
                <!-- message from field updates bubble to Depot.svelte -->
                {#if column.typeStr === "text"}
                <TextField bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "longtext"}
                <LongTextField bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "image"}
                <ImageField bind:data={line[column.name]} on:message fileKey={column.name}/>
                {:else if column.typeStr === "bool"}
                <BooleanField bind:data={line[column.name]} on:message/>
                {:else if column.typeStr === "enum"}
                <EnumField bind:data={line[column.name]} options={data.columns.find(x => x.name === column.name).options.split(', ')} on:message/>
                {:else if column.typeStr === "multiple"}
                <MultipleField bind:data={line[column.name]} options={data.columns.find(x => x.name === column.name).options.split(', ')} on:message/>
                {:else if column.typeStr === "int" || column.typeStr === "float"}
                <NumberField bind:data={line[column.name]} on:message/>
                {/if}
                </div>
                </td>
            {/each}
        </tr>
    {/each}
    </table>
{/if}
{#if debug}
<p>Current Table Data:</p>
<pre>{JSON.stringify({data},null,2)}</pre>
<p>----------------------------------------</p>
{/if}
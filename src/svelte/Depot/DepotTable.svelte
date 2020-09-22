<script>
import TextField from "../Fields/TextField.svelte";
import { v4 as uuidv4 } from 'uuid';
import { createEventDispatcher } from 'svelte';
export let data;

const dispatch = createEventDispatcher();
function openEditor(columnName) {
    //if we can ever click this we know that this table is the open table
    dispatch('message', {
        "type" : "editColumn",
        "data" : columnName
    });
    
}

function addLine() {
    dispatch('message', {
        "type" : "lineAdd"
    });
}

</script>

<br>
{#if data.columns.length === 0}
    <p>No columns</p>
{:else}
    <table>
    <tr>
        <th>Record</th>
        {#each data.columns as column}
            <th><a href={"#"} on:click={()=> openEditor(column.name)}>{column.name}</a></th>
        {/each}
    </tr>
    {#each data.lines as line}
        <tr>
            
        </tr>
    {/each}
    <button on:click={addLine}>Add Line</button>
    </table>
{/if}
<pre>{JSON.stringify({data},null,2)}</pre>
<p>----------------------------------------</p>
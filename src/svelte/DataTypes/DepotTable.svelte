<script>
import TextField from "../Fields/TextField.svelte";
import { v4 as uuidv4 } from 'uuid';
import { createEventDispatcher } from 'svelte';
import { table } from "console";
export let data;

const dispatch = createEventDispatcher();
function columnsUpdated() {
    dispatch('message', {
        "type" : "update"
    });
}

let openEditor = "";
function addColumn(columnType) {
    let uid = uuidv4();
    switch (columnType) {
        case "int":
            data.columns.push({
                "uid" : uid,
                "typeStr": "int",
                "name": "newInt"
            });
            break;
        case "bool":
            data.columns.push({
                "uid" : uid,
                "typeStr": "bool",
                "name": "newBool"
            });
            break;
        default:
            break;
    }
    columnsUpdated();
    openEditor = uid;
}

function closeEditor(){openEditor = "";}

</script>

<div>
    Name: <TextField bind:data={data.name} on:message/>
    <br>
</div>
<button on:click={() => addColumn("int")}>Add Int</button>
<button on:click={() => addColumn("bool")}>Add Bool</button>
<br>



{#if data.columns.length === 0}
    <p>No columns</p>
{:else}
    <table>
    <tr>
        <th>UID</th>
        {#each data.columns as column}
            <th><a href={"#"} on:click={()=> openEditor = column.uid}>{column.name}</a></th>
        {/each}
    </tr>
    {#if openEditor !== ""}
        <pre>{JSON.stringify(data.columns.find(o => o.uid === openEditor),null,2)}</pre>
        <button on:click={closeEditor}>Close</button>
        <button on:click={closeEditor}>Delete</button>
    {/if}
    <tr>
        <td>UID</td>
        <td>test</td>
        <td>test</td>
    </tr>
    </table>
{/if}
<pre>{JSON.stringify({data},null,2)}</pre>
<p>----------------------------------------</p>
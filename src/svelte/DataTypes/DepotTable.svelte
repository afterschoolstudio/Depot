<script>
import TextField from "../Fields/TextField.svelte";
export let data;

let showColumnEditor = false;
let fieldEdit = "";
function toggleColumnEditor(fieldType, visible) {
    fieldEdit = fieldType;
    showColumnEditor = visible;
}
function saveColumn(value) {
    showColumnEditor = false;
}
</script>

<div>
    Name: <TextField bind:data={data.name} on:message/>
    <br>
</div>
<button on:click={() => toggleColumnEditor("int", true)}>Add Int Column</button>
<button on:click={() => toggleColumnEditor("bool", true)}>Add Int Column</button>
<br>

{#if showColumnEditor}
<p>{fieldEdit}</p>
<button on:click={saveColumn}>Save Column</button>
{/if}
<table>
{#if data.columns.length === 0}
    <p>No columns</p>
{:else}
    {#each data.columns as column}
        <!-- <button on:click={focusSheet(data.sheets.indexOf(sheet))}>{sheet.name}</button> -->
    {/each}
{/if}
</table>
<pre>{JSON.stringify({data},null,2)}</pre>
<p>----------------------------------------</p>
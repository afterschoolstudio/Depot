<script>
import {defaults} from './depotDefaults';
import BooleanField from '../Fields/BooleanField.svelte';
import EnumField from '../Fields/EnumField.svelte';
import ImageField from '../Fields/ImageField.svelte';
import LongTextField from '../Fields/LongTextField.svelte';
import MultipleField from '../Fields/MultipleField.svelte';
import NumberField from '../Fields/NumberField.svelte';
import TextField from '../Fields/TextField.svelte';
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
function configUpdate(updateType) {
    dispatch('message', {
        "type" : updateType
    });
}

export let data;
export let config;
let configTitle = "";
$: {
    let first = config.operation === "new" ? "New " : "Edit ";
    let second = config.editType === "sheet" ? "sheet config" : "column config";
    configTitle = first + second;
}
function closeEditor() {
    configUpdate("close");
}
function createBlob() {
    configUpdate("create");
}
function saveBlob() {
    configUpdate("save");
}
function deleteBlob() {
    configUpdate("delete");
}

let validName = true;
$: disabled = validName;
$: { 
    switch (config.editType) {
        case "sheet":
            
            break;
        default:
            break;
    }
}

</script>
{#if config.active}
    <p>{configTitle}</p>
    <table>
    <tr>
        <td>Field</td>
        <td>Value</td>
    </tr>
    {#each Object.keys(defaults[config.editType].configurable) as fieldName}
        <tr>
            <td>{fieldName}</td>
            <td>
                {#if defaults[config.editType].configurable[fieldName] === "text"}
                <div><TextField bind:data={data[fieldName]}/></div>
                {:else if defaults[config.editType].configurable[fieldName] === "longtext"}
                <div><LongTextField bind:data={data[fieldName]}/></div>
                <!-- {:else if defaults[config.editType].configurable[fieldName] === "image"}
                <div><ImageField bind:data={data[fieldName]} fileKey={key}/></div> -->
                {:else if defaults[config.editType].configurable[fieldName] === "bool"}
                <div><BooleanField bind:data={data[fieldName]}/></div>
                {:else if defaults[config.editType].configurable[fieldName] === "enum"}
                <div><EnumField bind:data={data[fieldName]}/></div>
                {:else if defaults[config.editType].configurable[fieldName] === "multiple"}
                <div><MultipleField bind:data={data[fieldName]}/></div>
                {:else if defaults[config.editType].configurable[fieldName] === "int" || defaults[config.editType].configurable[fieldName] === "float"}
                <div><NumberField bind:data={data[fieldName]}/></div>
                {/if}
            </td>
        </tr>
    {/each}
    </table>
    <br>
    {#if config.operation === "new"}
    <button on:click={createBlob}>Create</button>
    {:else if config.operation === "edit"}
    <button on:click={saveBlob}>Save</button> 
    <button on:click={deleteBlob}>Delete</button>
    {/if}
    <button on:click={closeEditor}>Cancel</button>
    <pre>{JSON.stringify({data},null,2)}</pre>
    <pre>{JSON.stringify({config},null,2)}</pre>
{/if}
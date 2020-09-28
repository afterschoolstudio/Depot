<script>
import { createEventDispatcher } from 'svelte';
export let editSheetDisabled = false;
export let addLineDisabled = false;
export let allDisabled = false;
export let debug;
export let showLineGUIDs;
import {defaults} from './depotDefaults';
// $: disabled = editSheetDisabled;

const dispatch = createEventDispatcher();



</script>
<input type=checkbox bind:checked={debug}>Debug
<input type=checkbox bind:checked={showLineGUIDs}>Show Line GUIDs
<br>
<br>
<!-- <button on:click={() => createColumn("float")}>New Float</button>
<button on:click={() => createColumn("enum")}>New Enum</button>
<button on:click={() => createColumn("grid")}>New Grid</button> -->
<br><br>

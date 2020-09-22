<script>
import { createEventDispatcher } from 'svelte';
export let columnEditorsDisabled = false;
$: disabled = columnEditorsDisabled;

const dispatch = createEventDispatcher();
function editorUpdate(data) {
    dispatch('message', {
        "type" : "editorUpdate",
        "data" : data
    });
}

function openColumnEditor(columnType) {
    editorUpdate({
        "active" : true,
        "operation" : "new",
        "editType" : columnType,
    });
}

function openSheetEditor() {
    editorUpdate({
        "active" : true,
        "operation" : "new",
        "editType" : "sheet"
    });
}

</script>
<button on:click={openSheetEditor}>New Sheet</button>
<button on:click={() => openColumnEditor("int")} {disabled}>New Int</button>
<button on:click={() => openColumnEditor("bool")} {disabled}>New Bool</button>
<!-- <button on:click={() => createColumn("float")}>New Float</button>
<button on:click={() => createColumn("enum")}>New Enum</button>
<button on:click={() => createColumn("grid")}>New Grid</button> -->
<br><br>

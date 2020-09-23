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

function createColumn(columnType) {
    editorUpdate({
        "active" : true,
        "operation" : "new",
        "editType" : columnType,
    });
}

function createSheet() {
    editorUpdate({
        "active" : true,
        "operation" : "new",
        "editType" : "sheet"
    });
}

function editSheet() {
    editorUpdate({
        "active" : true,
        "operation" : "edit",
        "editType" : "sheet"
    });
}

</script>
<button on:click={createSheet}>New Sheet</button>
<button on:click={editSheet} {disabled}>Edit Sheet</button>
<button on:click={() => createColumn("int")} {disabled}>New Int</button>
<button on:click={() => createColumn("bool")} {disabled}>New Bool</button>
<!-- <button on:click={() => createColumn("float")}>New Float</button>
<button on:click={() => createColumn("enum")}>New Enum</button>
<button on:click={() => createColumn("grid")}>New Grid</button> -->
<br><br>

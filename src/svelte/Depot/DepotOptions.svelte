<script>
import { createEventDispatcher } from 'svelte';
export let editSheetDisabled = false;
export let addLineDisabled = false;
export let allDisabled = false;
// $: disabled = editSheetDisabled;

const dispatch = createEventDispatcher();

function createColumn(columnType) {
    dispatch('message', {
        "type" : "editorUpdate",
        "data" :{
                "active" : true,
                "operation" : "new",
                "editType" : columnType
                }
    });
}

function createSheet() {
    dispatch('message', {
        "type" : "editorUpdate",
        "data" :{
                "active" : true,
                "operation" : "new",
                "editType" : "sheet"
                }
    });

}

function editSheet() {
    dispatch('message', {
        "type" : "editorUpdate",
        "data" :{
                "active" : true,
                "operation" : "edit",
                "editType" : "sheet"
                }
    });
}

function newLine() {
    dispatch('message', {
        "type" : "sheetUpdate",
        "data" :{
                "operation" : "newLine"
                }
    });
}

</script>
<button on:click={createSheet} disabled={allDisabled}>New Sheet</button>
<button on:click={() => createColumn("int")} disabled={editSheetDisabled || allDisabled}>New Int</button>
<button on:click={() => createColumn("bool")} disabled={editSheetDisabled || allDisabled}>New Bool</button>
<br>
<button on:click={editSheet} disabled={editSheetDisabled || allDisabled}>Edit Sheet</button>
<button on:click={newLine} disabled={addLineDisabled || allDisabled}>New Line</button>
<!-- <button on:click={() => createColumn("float")}>New Float</button>
<button on:click={() => createColumn("enum")}>New Enum</button>
<button on:click={() => createColumn("grid")}>New Grid</button> -->
<br><br>

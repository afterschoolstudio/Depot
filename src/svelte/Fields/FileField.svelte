<script>
    import { getContext } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    export let data;
    export let sheetGUID;
    export let fileKey;
    const nonce = getContext("nonce");
    const dispatch = createEventDispatcher();
    function pickFile() {
        dispatch('message', {
            "type" : "pickFile",
            "fileKey" : fileKey,
            "data" : {
                "sheetGUID" : sheetGUID
            }
        });
    }
    function clearFile() {
        data = "";
        dispatch('message', {
            "type" : "update",
            "data" : {
                "sheetGUID" : sheetGUID
            }
        });
    }

    let hovering = false;

</script>

{#if data == ""}
    <button on:click={pickFile}>Pick</button>
{:else}
    <button on:click={pickFile}>Change</button>
    <button on:click={clearFile}>Clear</button>
    {data}
{/if}
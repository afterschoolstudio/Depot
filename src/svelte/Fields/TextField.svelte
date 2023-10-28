<script>
    import { createEventDispatcher } from 'svelte';

    export let data;
    export let sheetGUID;
    const dispatch = createEventDispatcher();
    function validateText() {
        dispatch('message', {
            "type" : "validate",
            "data" : {
                "sheetGUID" : sheetGUID
            }
        });
    }
</script>
<input bind:value={data} on:blur={validateText}>

<style>
    input {
        padding: 5px 5px 5px 5px;
        /* margin: 5px; */
        box-sizing: border-box;
        -webkit-box-sizing:border-box;
        -moz-box-sizing: border-box;
        font-size: 13px;
				border: 1px solid var(--vscode-input-border);
        background-color: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        width: 100%;
        height: 100%;
    }
</style>
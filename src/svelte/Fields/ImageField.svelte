<script>
    import { getContext } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    export let data;
    export let fileKey;
    const nonce = getContext("nonce");
    const dispatch = createEventDispatcher();
    function pickFile() {
        dispatch('message', {
            "type" : "pickFile",
            "fileKey" : fileKey
        });
    }
    function clearFile() {
        data = "";
    }
</script>

<!-- <button>Test</button> -->
{#if data == ""}
<button on:click={pickFile}>Pick</button>
{:else}
<button on:click={pickFile}>Pick</button>
<button on:click={clearFile}>Clear</button>
{data}
<!-- <img src={data} nonce={nonce} alt={data}> -->
<img src={data} alt={data}>
{/if}

<!-- <style>
    input {
        padding: 5px 5px 5px 5px;
        /* margin: 5px; */
        box-sizing: border-box;
        -webkit-box-sizing:border-box;
        -moz-box-sizing: border-box;
        border: 0px;
        font-size: 13px;
        border-width: 0px;
        background-color: #3c3c3c;
        color: #f0f0f0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }
</style> -->
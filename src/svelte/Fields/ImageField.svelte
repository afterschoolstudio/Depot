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
        dispatch('message', {
            "type" : "update"
        });
    }

    let hovering = false;

</script>

<!-- <button>Test</button> -->
{#if data == ""}
    <button on:click={pickFile}>Pick</button>
{:else}
    {#if hovering}
        <div style="width:400px;" on:mouseleave={()=>{hovering=false}}>
        <button on:click={pickFile}>Change</button>
        <button on:click={clearFile}>Clear</button>
        {data}
        <br>
        <img src={data} alt={data}>
        </div>
    {:else}
        <div style="width:50px;" on:mouseover={()=>{hovering=true}}>
        <img src={data} alt={data}>
        </div>
    {/if}
{/if}
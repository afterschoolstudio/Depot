<script>
    import { getContext } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import tippy from 'sveltejs-tippy';

    export let data;
    export let sheetGUID;
    export let fileKey;

    $: props = {
        content:
        '<img src="'+data+'">',
        allowHTML: true,
        placement: "bottom",
        duration: [0, 0]
    };

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
    }

    let hovering = false;

</script>

<style>
    .row {
        display: flex;
        width: 75px;
    }
    .bCol {
        display: flex;
        flex-direction: column;
        width: 25px;
        height: 50px;
        align-items: stretch
    }
</style>

<div on:mouseover={()=>{hovering=true}} on:mouseleave={()=>{hovering=false}}>
    <!-- <button>Test</button> -->
    {#if data == ""}
        <button on:click={pickFile}>Pick</button>
    {:else}
        <div class="row">
            <img style="width:50px;" src={data} title={data} alt={data} use:tippy={props} on:click={pickFile}>
            {#if hovering}
                <div class="bCol">
                    <button style="height: 25px" title="Clear image" on:click={clearFile}>X</button>
                    <button style="height: 25px" title="Change image" on:click={pickFile}>...</button>
                </div>
            {/if}
        </div>
{/if}
</div>
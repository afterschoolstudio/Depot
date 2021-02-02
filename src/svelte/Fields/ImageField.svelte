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
        dispatch('message', {
            "type" : "update",
            "data" : {
                "sheetGUID" : sheetGUID
            }
        });
    }

    let hovering = false;

</script>

<div on:mouseover={()=>{hovering=true}} on:mouseleave={()=>{hovering=false}}>
    <!-- <button>Test</button> -->
    {#if data == ""}
        <button on:click={pickFile}>Pick</button>
    {:else}
        <div style="width:50px;">
        <span>
        <img src={data} title={data} alt={data} use:tippy={props}>
        {#if hovering}
            <button on:click={pickFile}>Change</button>
            <button on:click={clearFile}>Clear</button>
            <!-- {data} -->
        {/if}
        </span>
        </div>
    {/if}
</div>
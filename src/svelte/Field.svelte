<script>
    import { createEventDispatcher } from 'svelte';

    export let data;
    const dispatch = createEventDispatcher();
    function fieldUpdated() {
        dispatch('message', {
            "type" : "update"
        });
    }
</script>
<input bind:value={data} on:input={fieldUpdated}>

<style>
    input {
        padding: 5px;
        font-size: 13px;
        border-width: 0px;
        background-color: #3c3c3c;
        color: #f0f0f0;
        width: 100%;
    }
</style>
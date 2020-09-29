<script>
    import { createEventDispatcher } from 'svelte';

    export let data;
    export let sheetGUID;
    const dispatch = createEventDispatcher();
    function fieldUpdated() {
        dispatch('message', {
            "type" : "update",
            "data" : {
                "sheetGUID" : sheetGUID
            }
        });
    }
</script>
<input type=checkbox bind:checked={data} on:change={fieldUpdated}>
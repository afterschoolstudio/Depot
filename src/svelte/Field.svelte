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

<label>
    <input bind:value={data} on:input={fieldUpdated}>
    <!-- <input bind:value={value} > -->
</label>
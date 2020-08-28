<script>
    import { createEventDispatcher } from 'svelte';

    export let json;
    export let key;
    // $: value = json[key];
    let value = json[key];
    const dispatch = createEventDispatcher();
    function fieldUpdated() {
        dispatch('message', {
            "key": key,
            "value": value
        });
    }
    // let value = interactableData[key];
    // function updateValue() {
    //     interactableData.update(d => d[key] = value)
    // }
</script>

<label>
    key: {key} <br>
    <input bind:value={value} on:input={fieldUpdated}>
    <!-- <input bind:value={value} > -->
</label>
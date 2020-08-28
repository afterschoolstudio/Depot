<script>
    // import { createEventDispatcher } from 'svelte';
    import { interactableData } from './dataStores.js';
    import { readable, get } from 'svelte/store'

    let value = get(interactableData.name);
    export let key;
    // $: value = json[key];
    // let value = json[key];
    // const dispatch = createEventDispatcher();
    function fieldUpdated() {
        // dispatch('message', {
        //     "key": key,
        //     "value": value
        // });
        interactableData.update(e => e[key] = value);
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
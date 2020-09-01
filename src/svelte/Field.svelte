<script>
    import { createEventDispatcher } from 'svelte';

    export let json;
    export let key;
    export let data;
    // $: value = json[key];
    // let value = json[key];
    console.log("value: " + data);
    const dispatch = createEventDispatcher();
    function fieldUpdated() {
        // dispatch('message', {
        //     "key": key,
        //     "value": value
        // });
        dispatch('message', {
            "type" : "update"
        });
    }
    // let value = interactableData[key];
    // function updateValue() {
    //     interactableData.update(d => d[key] = value)
    // }
</script>

<label>
    key: {key} <br>
    <input bind:value={data} on:input={fieldUpdated}>
    <!-- <input bind:value={value} > -->
</label>
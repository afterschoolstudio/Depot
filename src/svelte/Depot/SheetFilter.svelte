<script>
// import { createEventDispatcher } from 'svelte';
export let filterText;
// const dispatch = createEventDispatcher();
// function validateText() {
//     dispatch('message', {
//         "type" : "filter",
//         "data" : {
//             "filter" : sheetGUID
//         }
//     });
// }
</script>
<input bind:value={filterText}>

<style>
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
</style>
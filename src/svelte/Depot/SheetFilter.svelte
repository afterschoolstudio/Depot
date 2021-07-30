<script>
import { getContext } from 'svelte';
export let filterText;
let iconPaths = getContext("iconPaths");
function refreshText()
{
    filterText = filterText;
}
</script>
<input bind:value={filterText} on:blur={refreshText} on:input={refreshText} on:change={refreshText}>

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

    .buttonIcon {
        background-color: #3A3A3A;
        border: none;
        color: white;
        display: inline-block;
        cursor: pointer;
    }
    .buttonIcon:hover {
        background-color: #2A2D2E;
    }
    .buttonIcon:focus {
        outline: none;
        box-shadow: none;
    }
    .buttonIcon:active:focus {
        outline: none;
        box-shadow: none;
    }
    .buttonIcon.padded {
        margin: 5px 5px 5px 0px;
        width: 45px;
        height: 45px;
    }
    .buttonIcon.addLine {
        margin: 5px 0px 5px 0px;
        padding: 0px 0px 0px 0px;
    }
</style>
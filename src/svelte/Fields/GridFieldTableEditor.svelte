<script>
import { defaults } from "../Depot/depotDefaults";
import BooleanField from "./BooleanField.svelte";
import EnumField from "./EnumField.svelte";
import LongTextField from "./LongTextField.svelte";
import NumberField from "./NumberField.svelte";
import TextField from "./TextField.svelte";
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
function fieldUpdated() {
    dispatch('message', {
        "type" : "update",
        "data" : {
            "sheetGUID" : sheetGUID
        }
    });
}

export let data;
export let columnData;
export let sheetGUID;

let tableWidth = 100;
let tableHeight = 100;
$ : {
    tableWidth = columnData.displayWidth*columnData.columnWidth;
    tableHeight = columnData.length > columnData.displayWidth ? (columnData.length / columnData.displayWidth) * columnData.columnHeight : columnData.columnHeight;
}

</script>

<table style="width:{tableWidth}px;height:{tableHeight}px">
    {#each columnData.schema as s,outerIndex}
        {#if outerIndex % columnData.displayWidth === 0}
        <tr>
            {#each columnData.schema as schema,i}
                {#if i >= outerIndex && i < outerIndex + columnData.displayWidth}
                    <td style="width:{columnData.columnWidth}px;height:{columnData.columnHeight}px">
                        <div title="{[i]}">
                        {#if schema === "text"}
                            <TextField sheetGUID={sheetGUID} bind:data={data[i]} on:message/>
                        {:else if schema === "bool"}
                            <BooleanField sheetGUID={sheetGUID} bind:data={data[i]} on:message/>
                        {:else if schema === "longtext"}
                            <LongTextField sheetGUID={sheetGUID} bind:data={data[i]} on:message/>
                        {:else if schema === "float" || schema === "int"}
                            <NumberField sheetGUID={sheetGUID} bind:data={data[i]} on:message/>
                        {/if}
                        </div>
                    </td>
                {/if}
            {/each}
        </tr>
        {/if}
    {/each}
</table>
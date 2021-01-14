<script>
import { defaults } from "../Depot/depotDefaults";
import BooleanField from "./BooleanField.svelte";
import EnumField from "./EnumField.svelte";
import LongTextField from "./LongTextField.svelte";
import NumberField from "./NumberField.svelte";
import TextField from "./TextField.svelte";

export let schemaData;
export let defaultValues;
export let length;
export let displayWidth;
export let gridSettings;
export let columnWidth;
export let columnHeight;

$ : {
    //trim down the arrays
    schemaData = schemaData.slice(0,length);
    defaultValues = defaultValues.slice(0,length);
    if(length > schemaData.length) {
        //we've added new values, need to add in basic defaults
        let added = length - schemaData.length;
        for (let index = 0; index < added; index++) {
            schemaData.push("bool");
            defaultValues.push(true);
        }
    }
}

let allowedGridTypes = [];
$ : {
    allowedGridTypes = gridSettings.allowedTypes;
    let notImplemented = ["lineReference","sheetReference","multiple","enum"]
    //when those are implemented we need to comb for references to these field types should their set default values be deleted.
    allowedGridTypes = allowedGridTypes.filter(t => !notImplemented.includes(t));
}


let tableWidth = 100;
let tableHeight = 100;
$ : {
    tableWidth = displayWidth*columnWidth;
    tableHeight = length > displayWidth ? (length / displayWidth) * columnHeight : columnHeight;
}

function schemaUpdated(index) {
    //when the schema is update we need to update the default value for it based on that type 
    //the schema value itself is already updated due to the binding, just need default values to follow suit
    defaultValues[index] = defaults[schemaData[index]].defaultValue;
}

</script>
<table>
    <tr>
        <td>Length</td>
        <td>
            <NumberField bind:data={length}/>
        </td>
    </tr>
    <tr>
        <td>Display Width</td>
        <td>
            <NumberField bind:data={displayWidth}/>
        </td>
    </tr>
    <tr>
        <td>Column Width</td>
        <td>
            <NumberField bind:data={columnWidth}/>
        </td>
    </tr>
    <tr>
        <td>Column Height</td>
        <td>
            <NumberField bind:data={columnHeight}/>
        </td>
    </tr>
</table>
<table style="width:{tableWidth}px;height:{tableHeight}px">
    {#each schemaData as s,outerIndex}
        {#if outerIndex % displayWidth === 0}
        <tr>
            {#each schemaData as schema,i}
                {#if i >= outerIndex && i < outerIndex + displayWidth}
                    <td style="width:{columnWidth}px;height:{columnHeight}px">
                        [{i}]
                        <EnumField  allowEmpty={false}
                                    bind:data={schema}
                                    options={allowedGridTypes}
                                    on:message={() => schemaUpdated(i)}/>
                        <div>
                        {#if schema === "text"}
                            <TextField bind:data={defaultValues[i]}/>
                        {:else if schema === "bool"}
                            <BooleanField bind:data={defaultValues[i]}/>
                        {:else if schema === "longtext"}
                            <LongTextField bind:data={defaultValues[i]}/>
                        {:else if schema === "float" || schema === "int"}
                            <NumberField bind:data={defaultValues[i]}/>
                        {/if}
                        </div>
                    </td>
                {/if}
            {/each}
        </tr>
        {/if}
    {/each}
</table>
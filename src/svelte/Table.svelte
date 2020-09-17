<script>
import BooleanField from './Fields/BooleanField.svelte';
import EnumField from './Fields/EnumField.svelte';
import ImageField from './Fields/ImageField.svelte';
import LongTextField from './Fields/LongTextField.svelte';
import MultipleField from './Fields/MultipleField.svelte';
import NumberField from './Fields/NumberField.svelte';
import TextField from './Fields/TextField.svelte';

export let data = []
export let name;
export let meta;
//"heroSpriteIndex": 0,
</script>

<p><b>{name}</b></p>
<table>
    {#each [...meta. keys()] as key}
        {(console.log(key), '')}
        {(console.log(meta.get(key).desc), '')}
        <tr>
            {#if data[key] == undefined}
            <td title="test" class="fieldLabel error">{meta.get(key).name}</td>
            {:else}
            <td title={meta.get(key).description} class="fieldLabel">{meta.get(key).name}</td>
            {/if}
            {#if meta.get(key).type === "text"}
            <td><div><TextField bind:data={data[key]} on:message/></div></td>
            {:else if meta.get(key).type === "longtext"}
            <td><div><LongTextField bind:data={data[key]} on:message/></div></td>
            {:else if meta.get(key).type === "image"}
            <td><div><ImageField bind:data={data[key]} fileKey={key} on:message/></div></td>
            {:else if meta.get(key).type === "bool"}
            <td><div><BooleanField bind:data={data[key]} on:message/></div></td>
            {:else if meta.get(key).type === "enum"}
            <td><div><EnumField bind:data={data[key]} options={meta.get(key).values} on:message/></div></td>
            {:else if meta.get(key).type === "multiple"}
            <td><div><MultipleField bind:data={data[key]} options={meta.get(key).values} on:message/></div></td>
            {:else if meta.get(key).type === "int" || meta.get(key).type === "float"}
            <td><div><NumberField bind:data={data[key]} min={meta.get(key).min} max={meta.get(key).max} on:message/></div></td>
            {/if}
        </tr>
    {/each}
</table>

<style>
    .fieldLabel.error {
        color: rgb(255, 64, 64);
    }
</style>
<script>
import Field from './Field.svelte';
export let data = []
export let name;
export let meta;
</script>

<h2>{name}</h2>
<table>
    <!-- <tr>
        <th>Field</th>
        <th>Value</th>
    </tr> -->
    {#each [...meta. keys()] as key}
        {(console.log(key), '')}
        <tr>
            <td class="fieldLabel">{meta.get(key).name}</td>
            <td> <Field bind:data={data[key]} on:message/> </td>
        </tr>
    {/each}
</table>
<!-- <pre>{JSON.stringify({data},null,2)}</pre> --> 
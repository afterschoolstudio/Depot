<script>
import Field from './Field.svelte';
export let data;
export let name;
</script>

<h2>{name}</h2>
<table>
    <tr>
        <th>Field</th>
        <th>Value</th>
    </tr>
    {#each Object.keys(JSON.parse(JSON.stringify(data))) as key}
        <tr>
            <td>{key}</td>
            <td> <Field key={key} bind:data={data[key]} on:message/> </td>
        </tr>
    {/each}
</table>
<pre>{JSON.stringify({data},null,2)}</pre>
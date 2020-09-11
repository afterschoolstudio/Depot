<!-- <script>
import Field from './TextField.svelte';
export let data;
</script>

<h1>{data.name}</h1>
<table>
    <tr>
        <th>Field</th>
        <th>Value</th>
    </tr>
    {#each Object.keys(data) as key}
        <tr>
            <td>{key}</td>
            <td> <Field key={key} bind:data={data[key]} on:message/> </td>
        </tr>
    {/each}
</table> -->
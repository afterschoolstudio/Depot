<script>
import { each, init } from 'svelte/internal';
import Field from './Field.svelte';
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
</table>
<pre>
    {JSON.stringify({data},null,2)}
</pre>
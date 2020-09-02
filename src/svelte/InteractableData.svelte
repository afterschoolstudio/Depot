<script>
import { each, init } from 'svelte/internal';
import Field from './Field.svelte';
export let data;
</script>


<h1>{data.name}</h1>
{(console.log("testing .name for field bind"), '')}
<table>
    <tr>
        <th>Field</th>
        <th>Value</th>
    </tr>
    {#each Object. keys(data) as key}
        <tr>
            <td>{key}</td>
            <td> <Field key={key} bind:data={data[key]} on:message/> </td>
        </tr>
    {/each}

</table>
<pre>
    {JSON.stringify({data},null,2)}
</pre>

<style>
    table {
    /* border: 2px solid #252526; */
    width: 100%;
    text-align: left;
    }
    table td, table th {
        border:none;
        border-bottom: 3px solid #252526;
        border-right: 3px solid #252526;
        border-left: 3px solid #252526;
        padding: 5px 0px 5px 10px;
    }
    table td:nth-child(odd), table th:nth-child(even) {
        border-right: none;
    }
    table tbody td {
    font-size: 13px;
    }
    table th {
        background: #252526;
        font-size: 13px;
        font-weight: bold;
        /* color: #383838; */
        text-align: left;
    }
</style>
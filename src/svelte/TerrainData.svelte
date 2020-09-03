<script>
    import Field from './Field.svelte';
    import Table from './Table.svelte';
    export let data;
</script>

<h1>Cantata Terrain Editor</h1>
<Table name={"Manifest"} bind:data={data.manifest} on:message/>
<script>
    import Field from './Field.svelte';
    import Table from './Table.svelte';
    export let data;
    let manifestMeta = new Map([
        ['cantataDataVersion', 'Data Version'],
        ['owner', 'Owner'],
        ['version', 'Version'],
        ['guid', 'GUID'],
    ]);
</script>

<h1>Cantata Terrain Editor</h1>
<Table name={"Manifest"} bind:data={data.manifest} meta={manifestMeta} on:message/>
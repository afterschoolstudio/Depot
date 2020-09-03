<script>
    import Field from './Field.svelte';
    import Table from './Table.svelte';
    import { manifest, terrainData } from './cantataDataSpec.js';
    export let data;
</script>

<h1>Cantata Terrain Editor</h1>
<Table name={"Manifest"} bind:data={data.manifest} meta={manifest} on:message/>
<Table name={"Terrrain Info"} bind:data={data.info} meta={terrainData.info} on:message/>
<!-- <Table name={"Info"} bind:data={data.manifest} meta={infoMeta} on:message/>
<Table name={"Sprite Info"} bind:data={data.manifest} meta={spriteMeta} on:message/>
<Table name={"Generator Info"} bind:data={data.manifest} meta={generatorMeta} on:message/> -->
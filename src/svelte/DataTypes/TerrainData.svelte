<script>
    import Table from '../Table.svelte';
    import { manifest, terrainData } from '../cantataDataSpec.js';
    export let data;
</script>

<h1>Cantata Terrain Editor</h1>
<Table name={"Manifest"} bind:data={data.manifest} meta={manifest} on:message/>
<Table name={"Info"} bind:data={data.info} meta={terrainData.info} on:message/>
<Table name={"Sprite"} bind:data={data.spriteInfo} meta={terrainData.spriteInfo} on:message/>
<Table name={"Gameplay"} bind:data={data.gameplay} meta={terrainData.gameplay} on:message/>
<Table name={"Generator"} bind:data={data.generatorInfo} meta={terrainData.generatorInfo} on:message/>
<!-- <Table name={"Info"} bind:data={data.manifest} meta={infoMeta} on:message/>
<Table name={"Sprite Info"} bind:data={data.manifest} meta={spriteMeta} on:message/>
<Table name={"Generator Info"} bind:data={data.manifest} meta={generatorMeta} on:message/> -->
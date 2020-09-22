<script>
export let data;
function closeEditor() {
    data = {"active":false};
}
</script>
{#if data.active}
<pre>{JSON.stringify({data},null,2)}</pre>
<!-- <button>Save</button>
<button>Delete</button> -->
<button on:click={closeEditor}>Cancel</button>
{:else}
<p>No context set</p>
{/if}
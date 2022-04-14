<script>
  import { getContext } from "svelte";
  import { createEventDispatcher } from "svelte";

  export let data;
  export let sheetGUID;
  export let fileKey;
  const nonce = getContext("nonce");
  const dispatch = createEventDispatcher();
  function pickFile() {
    dispatch("message", {
      type: "pickFile",
      fileKey: fileKey,
      data: {
        sheetGUID: sheetGUID,
      },
    });
  }
  function clearFile() {
    data = "";
  }

  let hovering = false;
</script>

{#if data == ""}
  <button class="sheetButton fullWidth" on:click={pickFile}>Pick</button>
{:else}
  <button class="sheetButton" on:click={pickFile}>Change</button>
  <button class="sheetButton" on:click={clearFile}>Clear</button>
  {data}
{/if}

<style>
  .fullHeight {
    height: 100%;
  }

  .fullWidth {
    width: 100%;
  }

  .sheetButton {
    background-color: #3a3a3a;
    border: none;
    color: white;
    display: inline-block;
    cursor: pointer;
    margin: 0px 5px 0px 0px;
    padding: 8px 8px 8px 8px;
  }
  .sheetButton:hover {
    background-color: #252526;
  }
  .sheetButton.selected {
    background-color: #252526;
  }
  .sheetButton:focus {
    outline: none;
    box-shadow: none;
  }
  .sheetButton:active:focus {
    outline: none;
    box-shadow: none;
  }
</style>

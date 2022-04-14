<script>
  import { getContext } from "svelte";
  import { createEventDispatcher } from "svelte";
  import tippy from "sveltejs-tippy";

  export let data;
  export let sheetGUID;
  export let fileKey;

  $: props = {
    content: '<img src="' + data + '">',
    allowHTML: true,
    placement: "bottom",
    duration: [0, 0],
  };

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

<div
  on:mouseover={() => {
    hovering = true;
  }}
  on:mouseleave={() => {
    hovering = false;
  }}
>
  <!-- <button>Test</button> -->
  {#if data == ""}
    <button class="sheetButton fullWidth" on:click={pickFile}>Pick</button>
  {:else}
    <div class="row">
      <img
        style="width:50px;object-fit: contain;"
        src={data}
        title={data}
        alt={data}
        use:tippy={props}
        on:click={pickFile}
      />
      {#if hovering}
        <div class="bCol">
          <button
            class="sheetButton fullWidth"
            style="height: 25px"
            title="Clear image"
            on:click={clearFile}>X</button
          >
          <button
            class="sheetButton fullWidth"
            style="height: 25px"
            title="Change image"
            on:click={pickFile}>...</button
          >
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .row {
    display: flex;
    width: 75px;
  }
  .bCol {
    display: flex;
    flex-direction: column;
    height: 50px;
    width: 100%;
    align-items: stretch;
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

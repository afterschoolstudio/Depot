<script>
  export let data;
  let showDialog = false;
  function openDialog() {
    showDialog = true;
  }
  function closeDialog() {
    showDialog = false;
  }
</script>

<div>
  <textarea bind:value={data} />
  <br />
  <button on:click={openDialog} class="sheetButton fullHeight"> Edit </button>
</div>
<!-- show dialg if useDialog is true -->
{#if showDialog}
  <div
    style="
    position: fixed;
    background-color: rgba(0,0,0,0.8);
    width: 100vw;
    height:  100vh;
    left: 0;
    top: 0;
    z-index: 0;
"
  />
  <dialog id="textDialog" open>
    <textarea bind:value={data} />
    <button on:click={closeDialog} class="sheetButton fullWidth"> Ok </button>
  </dialog>
{/if}

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 75%;
    height: 75%;
    z-index: 9999;
    background-color: #141414;
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    color: -internal-light-dark(black, white);
    margin: auto;
    border-width: initial;
    border-style: solid;
    border-color: initial;
    border-image: initial;
    padding: 1em;
    background: -internal-light-dark(white, black);
  }

  dialog:-internal-modal {
    position: fixed;
    top: 0px;
    bottom: 0px;
    max-width: calc((100% - 6px) - 2em);
    max-height: calc((100% - 6px) - 2em);
    user-select: text;
    overflow: auto;
  }

  dialog::backdrop {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.1);
  }

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

  textarea {
    padding: 5px;
    margin: 5px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    border: 0px;
    font-size: 13px;
    border-width: 0px;
    background-color: #3c3c3c;
    color: #f0f0f0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    resize: none;
  }
</style>

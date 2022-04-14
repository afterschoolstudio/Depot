<script>
  export let data;
</script>

<div style="display:flex; flex-direction:row;">
  <label class="switch">
    <input type="checkbox" bind:checked={data} />
    <span class="slider round" />
  </label>
  <div style="width: 40px; display:flex; align-items: center;">
    <span
      style="display: inline-block; vertical-align: middle; line-height: normal;"
    >
      {data ? "True" : "False"}
    </span>
  </div>
</div>

<style>
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    transform: scale(0.7);
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #3a3a3a00;
    border: #3a3a3a solid 3px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 1px;
    bottom: 1px;
    background-color: #7c7c81;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: var(--vscode-textLink-foreground);
    border: var(--vscode-textLink-foreground) solid 3px;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px var(--vscode-textLink-foreground);
    border: var(--vscode-textLink-foreground) solid 3px;
  }

  input:checked + .slider:before {
    background-color: white;
  }

  input:focus + .slider:before {
    background-color: white;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>

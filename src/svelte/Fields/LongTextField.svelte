<script>
export let data;
</script>
<textarea bind:value={data}></textarea>
<style>
    textarea {
        padding: 5px 5px 5px 5px;
        /* margin: 5px; */
        box-sizing: border-box;
        -webkit-box-sizing:border-box;
        -moz-box-sizing: border-box;
        font-size: 13px;
				border: 1px solid var(--vscode-input-border);
        background-color: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        width: 100%;
        height: 100%;
    }
</style>

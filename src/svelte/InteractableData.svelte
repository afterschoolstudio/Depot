<script>
    import { onMount, setContext } from 'svelte';
    import Field from './Field.svelte';

    // const vscode = acquireVsCodeApi();
    function handleClick() {
        vscode.postMessage({
            type: 'testsvelte'
        });
        // count += 1;
    }
    
    function windowMessage(event) {
        const message = event.data; // The json data that the extension sent
		switch (message.type) {
			case 'update':
				const text = message.text;

                // Update our webview's content
                // vscode.window.showInformationMessage("recieved update");
				updateContent(text);

				// Then persist state information.
				// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
				vscode.setState({ text });

				return;
		}
    }

    function updateData(key) {
        vscode.postMessage({
            type: 'updateDocumentFromInput',
            update: {"key" : key, "value" : interactableJSON[key]}
		});
    }

    let interactableJSON = {};
	function updateContent(/** @type {string} */ text) {
		try {
            interactableJSON = JSON.parse(text);
            console.log(interactableJSON);
            // vscode.window.showInformationMessage(interactableJSON);
		} catch {
            // vscode.window.showErrorMessage("json read issue");
			// notesContainer.style.display = 'none';
			// errorContainer.innerText = 'Error: Document is not valid json';
			// errorContainer.style.display = '';
			return;
		}
	}

    const state = vscode.getState();
	if (state) {
		updateContent(state.text);
    }
    
    setContext("data", interactableJSON);

    // setContext("data", {
    //     getData: () => data
    // });

</script>

<svelte:window on:message={windowMessage}/>
<h1>{interactableJSON.name}</h1>
<!-- <button on:click={handleClick}>
    {interactableJSON.name}
</button> -->
<!-- <Field key={"name"} description={"something"}> -->
<input bind:value={interactableJSON.name} on:input={() => updateData("name")}>
<input bind:value={interactableJSON.another_value} on:input={() => updateData("another_value")}>
<!-- <svelte:window on:={handleKeydown}/> -->
<script>
    import { onMount, setContext } from 'svelte';
    // const vscode = acquireVsCodeApi();
    function handleClick() {
        vscode.postMessage({
            type: 'testsvelte'
        });
        // count += 1;
    }
    
    function windowMessage(event) {
        const message = event.data; // The json data that the extension sent
        vscode.postMessage({
            type: 'updateRecieved'
        });
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

    function updateName() {
        console.log("updaing name to:");
        console.log(interactableJSON);
        vscode.postMessage({
            type: 'updateName',
            json: interactableJSON
		});
    }

    let interactableJSON = {};
	function updateContent(/** @type {string} */ text) {
		try {
            interactableJSON = JSON.parse(text);
            console.log(interactableJSON);
            vscode.window.showInformationMessage(interactableJSON);
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
    // setContext("data", {
    //     getData: () => data
    // });

    // let data = interactableJSON;
    // setContext("data", data);
    // setContext("data", "tedt");

</script>

<svelte:window on:message={windowMessage}/>
<button on:click={handleClick}>
    {interactableJSON.name}
	<!-- Clicked {count} {count === 1 ? 'time' : 'times'} -->
</button>
<input bind:value={interactableJSON.name} on:input={updateName}>
<!-- <svelte:window on:={handleKeydown}/> -->
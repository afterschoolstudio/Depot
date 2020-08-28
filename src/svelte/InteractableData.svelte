<script>
    // import { interactableData } from './dataStores.js';
    import Field from './Field.svelte';
    // import { onDestroy } from 'svelte';

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
            update: {"key" : key, "value" : InteractableJSON[key]}
		});
    }

    function handleMessage(event) {
        console.log("filed update handle");
        // console.log(event.detail.key);
        //could switch here for data objects to pass in the json as well
        InteractableJSON[event.detail.key] = event.detail.value;
        updateData(event.detail.key);
    }

    let InteractableJSON = {};
    // let interactableName;
    // const unsubscribe = interactableData.subscribe(value => {
    //     interactableName = value.name;
    //     console.log("data updated from field update, new data:");
    //     console.log(value);
    //     vscode.postMessage({
    //         type: 'updateDocumentFromInput',
    //         update: value
    //     });
	// });

	// onDestroy(unsubscribe);



	function updateContent(/** @type {string} */ text) {
		try {
            console.log(JSON.parse(text));
            // interactableData.update(n => n = JSON.parse(text))
            InteractableJSON = JSON.parse(text);
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
    
    // setContext("data", interactableJSON);

    // setContext("data", {
    //     getData: () => data
    // });

</script>

<svelte:window on:message={windowMessage}/>
<h1>{InteractableJSON.name}</h1>
<!-- <button on:click={handleClick}>
    {interactableJSON.name}
</button> -->
<Field json={InteractableJSON} key={"name"} on:message={handleMessage}/>
<br>
<Field json={InteractableJSON} key={"another_value"} on:message={handleMessage}/>
<!-- <input bind:value={interactableJSON.name} on:input={() => updateData("name")}>
<input bind:value={interactableJSON.another_value} on:input={() => updateData("another_value")}> -->
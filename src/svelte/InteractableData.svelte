<script>
    import { each, init } from 'svelte/internal';

    // import { interactableData } from './dataStores.js';
    import Field from './Field.svelte';
    import { onMount } from 'svelte';

    let InteractableJSON = {
        };

    // const vscode = acquireVsCodeApi();
    function handleClick() {
        vscode.postMessage({
            type: 'testsvelte'
        });
        // count += 1;
    }

    // const state = vscode.getState();
    // function initData() {
    //     console.log("onload initing data");
    //     if (state) {
    //         //we push this state from the vscode workspace to the JSON this component is looking at
    //         console.log("found previous state: " + state.text);
    //         InteractableJSON = JSON.parse(state.text);
    //     }
    //     else
    //     {
    //         //grab new content
    //         console.log("no previous state: initing");
    //         // this pings the document to send us its state
    //         // it's then recieved in the windowMessage function where we update our content
    //         vscode.postMessage({
    //             type: 'initDoc'
    //         });
    //     }
    // }

    // onMount(() => {
    //    initData();
    // });

    function windowMessage(event) {
        const message = event.data; // The json data that the extension sent
		switch (message.type) {
            case 'init':
                //the extension is sending us an init event with the document text
                //not this is the document NOT the state, the state takes precendece
                const state = vscode.getState();
                if (state) {
                    //we push this state from the vscode workspace to the JSON this component is looking at
                    console.log("found previous state: " + state.text);
                    updateContent(state.text);
                }
                else
                {
                    //grab new content
                    console.log("no previous state: initing");
                    // this pings the document to send us its state
                    // it's then recieved in the windowMessage function where we update our content
                    updateContent(message.text);
                }
                return;
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
        // InteractableJSON[event.detail.key] = event.detail.value;
        console.log(InteractableJSON);

        vscode.postMessage({
            type: 'update',
            data: InteractableJSON
		});
        // updateData(event.detail.key);
    }



	function updateContent(/** @type {string} */ text) {
        console.log("updating content");
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

</script>

<svelte:window on:message={windowMessage}/>
{(console.log("initing rendering"), '')}
<!-- {#if Object.keys({InteractableJSON}).length !== 0} -->

<!-- <svelte:window on:load={initData} on:message={windowMessage}/> -->
<h1>{InteractableJSON.name}</h1>
<!-- <button on:click={handleClick}>
    {interactableJSON.name}
</button> -->
{(console.log("testing .name for field bind"), '')}
<table>
    <tr>
        <th>Key</th>
        <th>Value</th>
    </tr>
    <!-- <Field key={"field name"} bind:data={InteractableJSON.name} on:message={handleMessage}/> -->
    <!-- this could be used to iterate through keys for things that are simple filed updates with raw text input -->
    {#each Object.keys(InteractableJSON) as key}
        <tr>
            <td>{key}</td>
            <td> <Field key={key} bind:data={InteractableJSON[key]} on:message={handleMessage}/> </td>
        </tr>
    {/each}

</table>

<pre>
    {JSON.stringify({InteractableJSON},null,2)}
</pre>
<!-- {:else} -->
<!-- <p>Loading</p> -->
<!-- <input bind:value={interactableJSON.name} on:input={() => updateData("name")}>
    <input bind:value={interactableJSON.another_value} on:input={() => updateData("another_value")}> -->
<!-- {/if} -->
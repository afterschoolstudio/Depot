<script>
    import { each, init } from 'svelte/internal';

    // import { interactableData } from './dataStores.js';
    import Field from './Field.svelte';
    import { onMount } from 'svelte';

    let InteractableJSON = {};

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

    function getData() {
        //send a call out to extension to get the data
        //callback will hit the update route in our window message reciever
        vscode.postMessage({
            type: 'getData',
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
{#if Object.keys(InteractableJSON).length === 0}
{(console.log("no keys, loading"), '')}
<p>Loading</p>
{getData()}
{:else}
<!-- <svelte:window on:load={initData} on:message={windowMessage}/> -->
<h1>{InteractableJSON.name}</h1>
{(console.log("testing .name for field bind"), '')}
<table>
    <tr>
        <th>Field</th>
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
{/if}

<pre>
    {JSON.stringify({InteractableJSON},null,2)}
</pre>

<style>
    table {
    /* border: 2px solid #252526; */
    width: 100%;
    text-align: left;
    }
    table td, table th {
        border:none;
        border-bottom: 3px solid #252526;
        border-right: 3px solid #252526;
        border-left: 3px solid #252526;
        padding: 5px 0px 5px 10px;
    }
    table td:nth-child(odd), table th:nth-child(even) {
        border-right: none;
    }
    table tbody td {
    font-size: 13px;
    }
    table th {
        background: #252526;
        font-size: 13px;
        font-weight: bold;
        /* color: #383838; */
        text-align: left;
    }
</style>
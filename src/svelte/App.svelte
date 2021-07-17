<!--
Copyright 2020 Kyle Kukshtel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<script>
    import Depot from './Depot/Depot.svelte'
    import { onMount, setContext } from 'svelte';
    import resolvePath from 'object-resolve-path';

	onMount(() => {
        setContext("nonce", nonce);
        setContext("iconPaths", icons);
        vscode.postMessage({
            type: 'init-view',
		});
    });
    

	let dataType = "";
    let jsonData = {};

	function windowMessage(event) {
        const message = event.data; // The json data that the extension sent
		switch (message.type) {
            case 'init':
				console.log("initing view");
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
				dataType = message.jsonType;
                return;
			case 'update':
                console.log("updating view");
				const text = message.text;

                // Update our webview's content
				updateContent(text);

				// Then persist state information.
				// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
				vscode.setState({ text });

                return;
            case 'filePicked':
                var dataPath = message.fileKey;
                if("linePath" in dataPath) {
                    let line = resolvePath(jsonData["sheets"][dataPath.sheet].lines, dataPath.linePath);
                    line[dataPath.lineIndex][dataPath.column.name] = message.filePath;
                } else {
                    jsonData["sheets"][dataPath.sheet].lines[dataPath.lineIndex][dataPath.column.name] = message.filePath;
                }
                vscode.postMessage({
                    type: 'update',
                    data: jsonData
                });
                return;
		}
    }
	
	function handleMessage(event) {
        console.log(event);
        switch (event.detail.type) {
            case "update":
                console.log("pushing data",jsonData)
                //this is where we could conform the data, like flooring an int field if it gets a float value
                vscode.postMessage({
                    type: 'update',
                    data: jsonData
                });
                break;
            case "pickFile":
                console.log("firing file picker");
                vscode.postMessage({
                    type: 'pickFile',
                    fileKey: event.detail.fileKey
                });
                break;
            default:
                break;
        }
        
	}

	function updateContent(/** @type {string} */ text) {
        console.log("updating content");
		try {
            console.log(JSON.parse(text));
            // interactableData.update(n => n = JSON.parse(text))
            jsonData = JSON.parse(text);
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
{#if dataType == ""}
	<p>Loading</p>
{:else if dataType === "depot"}
    <Depot bind:data={jsonData} on:message={handleMessage}/>
{:else}
	<p>Error: Invalid Data Type {dataType}</p>
{/if}

<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	/* Table Stuff */
	:global(table) {
        /* border: 2px solid #252526; */
        width: 100%;
        text-align: left;
        border-collapse: collapse;
    }
    :global(table td) {
        border:3px solid #252526;
        padding: 0px;
        /* width: 50% */
    } 
    :global(table td) {
        border:3px solid #252526;
        padding: 0px;
        /* width: 50% */
    } 
    :global(table tbody td) {
        font-size: 13px;
    }
    :global(table tr td.fieldLabel) {
        /* padding-left: 5px; */
        padding: 5px;
    }
    :global(table th) {
        background: #252526;
        font-size: 13px;
        font-weight: bold;
        text-align: left;
    }

</style>